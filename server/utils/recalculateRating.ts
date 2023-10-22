export const FIXED_RATING_CHANGING_NUM = 5;

export function recalculateRating(winnerRating: number, loserRating: number) {
  const diff = winnerRating - loserRating;
  let optionalRatingChangingNum = 0;
  let additionalWinnerNum = 0;

  if (winnerRating === loserRating) {
    return {
      newWinnerRating: winnerRating + FIXED_RATING_CHANGING_NUM,
      newLoserRating: loserRating - FIXED_RATING_CHANGING_NUM,
    };
  }

  if (diff >= 20) {
    if (diff < 50) {
      optionalRatingChangingNum = -1;
    } else if (diff < 80) {
      optionalRatingChangingNum = -2;
    } else if (diff < 110) {
      optionalRatingChangingNum = -3;
    } else if (diff < 140) {
      optionalRatingChangingNum = -4;
    } else {
      optionalRatingChangingNum = -5;
    }
  }

  if (diff < -40) {
    optionalRatingChangingNum = -Math.ceil((diff + 40) / 10);
  }

  if (diff <= -150) {
    additionalWinnerNum = -Math.ceil(diff / 5);
  }

  if (diff <= -250) {
    additionalWinnerNum = -Math.ceil(diff / 3);
  }

  if (diff <= -450) {
    additionalWinnerNum = -Math.ceil(diff / 2);
  }

  return {
    newWinnerRating:
      winnerRating +
      FIXED_RATING_CHANGING_NUM +
      optionalRatingChangingNum +
      additionalWinnerNum +
      1,
    newLoserRating:
      loserRating - FIXED_RATING_CHANGING_NUM - optionalRatingChangingNum,
  };
}
