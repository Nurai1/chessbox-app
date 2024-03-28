export const getPairsAmountByParticipants = (participantsLength: number) => {
  if (participantsLength < 1) {
    throw new Error("Participant's length can't be less than 1");
  }

  let done = false;
  let i = 1;
  let logarithm;
  let allPairsLen = 0;

  do {
    logarithm = Math.log2(i);
    if (
      2 ** logarithm <= participantsLength &&
      2 ** (logarithm + 1) > participantsLength
    ) {
      done = true;
    } else {
      allPairsLen += 2 ** logarithm;
      i *= 2;
    }
  } while (done !== true);

  const amountForCurrentRound = (participantsLength - 2 ** logarithm) * 2;
  if (amountForCurrentRound !== 0) {
    return allPairsLen + amountForCurrentRound / 2;
  }

  return allPairsLen;
};
