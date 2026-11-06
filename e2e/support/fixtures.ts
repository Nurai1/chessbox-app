import { test as base, devices, BrowserContext, Page } from '@playwright/test';
import { MongoClient } from 'mongodb';
import { TestData } from './data';
import { environment } from './environment';
import { Mailbox } from './mailbox';

type Fixtures = {
  data: TestData;
  mailbox: Mailbox;
  actor: (mobile?: boolean) => Promise<Page>;
};

export const test = base.extend<Fixtures>({
  data: async ({}, use, testInfo) => {
    const client = new MongoClient(environment.mongo, { serverSelectionTimeoutMS: 10_000 });
    const data = new TestData(client.db());
    try {
      await client.connect();
      await data.seed();
      await testInfo.attach('fixture-namespace', { body: data.namespace, contentType: 'text/plain' });
      await use(data);
    } finally {
      try {
        await data.cleanup();
      } finally {
        await client.close();
      }
    }
  },
  mailbox: async ({ request }, use) => {
    const mailbox = new Mailbox(request);
    try {
      await use(mailbox);
    } finally {
      await mailbox.cleanup();
    }
  },
  // Each actor has separate cookies, localStorage and sessionStorage.
  // Depending on data ensures contexts close before fixture records are removed.
  actor: async ({ browser, data }, use, testInfo) => {
    const contexts: BrowserContext[] = [];
    void data;
    try {
      await use(async (mobile = false) => {
        const context = await browser.newContext({
          ...(mobile ? devices['iPhone 13'] : devices['Desktop Chrome']),
          baseURL: environment.web,
          locale: 'en-US',
          recordVideo: {
            dir: testInfo.outputPath('videos'),
            size: mobile ? { width: 390, height: 844 } : { width: 1280, height: 720 },
          },
        });
        contexts.push(context);
        await context.addInitScript(() => localStorage.setItem('i18nextLng', 'en'));
        return context.newPage();
      });
    } finally {
      const results = await Promise.allSettled(contexts.map(async (context, index) => {
        try {
          if (testInfo.status !== testInfo.expectedStatus) {
            const page = context.pages()[0];
            if (page && !page.isClosed()) {
              await testInfo.attach(`actor-${index}-screenshot`, {
                body: await page.screenshot(), contentType: 'image/png',
              });
            }
          }
        } finally {
          const videos = context.pages().map(page => page.video()).filter(video => video !== null);
          await context.close();
          for (const [pageIndex, video] of videos.entries()) {
            const videoPath = testInfo.outputPath(`actor-${index}-page-${pageIndex}.webm`);
            await video.saveAs(videoPath);
            await testInfo.attach(`actor-${index}-page-${pageIndex}-video`, {
              path: videoPath, contentType: 'video/webm',
            });
          }
        }
      }));
      const failures = results.filter((result): result is PromiseRejectedResult => result.status === 'rejected');
      if (failures.length) throw new AggregateError(failures.map(result => result.reason), 'Browser cleanup failed');
    }
  },
});

export { expect } from '@playwright/test';
