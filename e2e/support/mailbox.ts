import { APIRequestContext, expect } from '@playwright/test';
import { environment } from './environment';

type MessageSummary = { ID: string; To: { Address: string }[]; Subject: string };

export class Mailbox {
  private readonly readIds = new Set<string>();
  constructor(private readonly request: APIRequestContext) {}

  async messages(email: string): Promise<MessageSummary[]> {
    const response = await this.request.get(`${environment.mailpit}/api/v1/search`, {
      params: { query: `to:${email}`, limit: 100 },
    });
    expect(response.ok(), 'Mailpit search should succeed').toBeTruthy();
    const body = await response.json();
    return (body.messages as MessageSummary[]).filter(message =>
      message.To.some(recipient => recipient.Address.toLowerCase() === email.toLowerCase()),
    );
  }

  async confirmationLink(email: string) {
    let message: MessageSummary | undefined;
    await expect.poll(async () => {
      message = (await this.messages(email)).find(item => item.Subject.includes('Confirm your email'));
      return Boolean(message);
    }, { timeout: 20_000, message: `Confirmation email for ${email}` }).toBe(true);

    const id = message!.ID;
    this.readIds.add(id);
    const response = await this.request.get(`${environment.mailpit}/api/v1/message/${id}`);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    const link = (body.Text as string).match(/https?:\/\/[^\s<>]+#\/email-confirmation/)?.[0];
    if (!link) throw new Error('Confirmation link missing from actual SMTP message');
    const url = new URL(link);
    expect(url.origin).toBe(environment.web);
    expect(url.searchParams.get('email')).toBe(email);
    return link;
  }

  async cleanup() {
    if (!this.readIds.size) return;
    // Never delete the whole mailbox; unrelated messages can already exist.
    const response = await this.request.delete(`${environment.mailpit}/api/v1/messages`, {
      data: { IDs: [...this.readIds] },
    });
    expect(response.ok(), 'Delete only messages read by this test').toBeTruthy();
  }
}
