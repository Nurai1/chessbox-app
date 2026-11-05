import { z } from 'zod';

export const emailParser = z.string().email().min(5);
export const passwordParser = z.string().min(4 /* 8 */);
export const ConfirmEmailParser = z.object({
  email: emailParser,
  confirmationCode: z
    .union([z.string().regex(/^\d{4}$/), z.number().int().min(1000).max(9999)])
    .transform(Number),
});
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

export const CreateCoachParticipantParser = CreateUserParser.extend({
  email: emailParser.trim(),
  password: passwordParser.min(8),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  weight: z.number().positive().max(199),
  birthDate: z.string().refine((value) => {
    const time = Date.parse(value);
    return Number.isFinite(time) && time <= Date.now();
  }, 'Invalid birth date'),
});

// Profile edits cannot change roles, ownership, payment state or rating.
export const UpdateProfileParser = CreateUserParser.omit({ password: true })
  .partial()
  .extend({
    socialNetworks: z.object({ whatsup: z.string().optional() }).optional(),
  });
