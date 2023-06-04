import { IPair, IUser } from '../types';

export const getPairsWithJudges = ({
  pairs,
  judges,
}: {
  pairs: IPair[];
  judges: IUser[];
}) => {
  return pairs.map((pair, index) => {
    const judgesNum = judges?.length;
    const currentJudgeIndex = index % judgesNum;

    return {
      ...pair,
      judge: judges[currentJudgeIndex],
    };
  });
};
