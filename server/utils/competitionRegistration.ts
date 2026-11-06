import { ROLES } from '../constants';
import { ICompetition, IUser } from '../types';

export const canRequestParticipantPayment = (
  actor: IUser,
  participant: IUser
) =>
  participant.role === ROLES.PARTICIPANT &&
  ((actor.role === ROLES.PARTICIPANT &&
    actor._id.toString() === participant._id.toString()) ||
    actor.role === ROLES.COACH);

export const isCompetitionRegistrationOpen = (competition: ICompetition) =>
  !competition.started &&
  !competition.endDate &&
  new Date(competition.registrationEndsAt).getTime() > Date.now();

export const fitsCompetitionRequirements = (
  competition: ICompetition,
  participant: IUser
) => {
  const { requirements } = competition;
  if (!requirements) return true;
  const birthDate = new Date(participant.birthDate);
  const now = new Date();
  const beforeBirthday =
    now.getMonth() < birthDate.getMonth() ||
    (now.getMonth() === birthDate.getMonth() &&
      now.getDate() < birthDate.getDate());
  const age =
    now.getFullYear() - birthDate.getFullYear() - (beforeBirthday ? 1 : 0);
  return (
    Number.isFinite(age) &&
    Number.isFinite(participant.weight) &&
    participant.weight >= (requirements.weightCategory?.from ?? 0) &&
    participant.weight <= (requirements.weightCategory?.to ?? 1000) &&
    age >= (requirements.ageCategory?.from ?? 0) &&
    age <= (requirements.ageCategory?.to ?? 119) &&
    (!requirements.gender || participant.gender === requirements.gender)
  );
};
