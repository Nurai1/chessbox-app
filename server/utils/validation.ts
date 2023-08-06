import { z } from 'zod';

export const emailParser = z.string().email().min(5);
export const passwordParser = z.string().min(4 /* 8 */);
export const CreateUserParser = z.object({
  email: emailParser,
  password: passwordParser,
  firstName: z.string(),
  lastName: z.string(),
  weight: z.number(),
  chessPlatform: z.object({ username: z.string() }),
  birthDate: z.string(),
  gender: z.enum(['woman', 'man']),
  address: z.object({
    country: z.string(),
    city: z.string(),
  }),
  fightClub: z.object({ name: z.string() }),
});
