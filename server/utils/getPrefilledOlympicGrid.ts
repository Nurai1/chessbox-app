/* eslint-disable no-param-reassign */

export type GridTree = { userId?: string; pair?: [GridTree, GridTree] };

export const getPrefilledOlympicGrid = (
  allParticipants: string[],
  currentRoundParticipantsAmount: number,
  circlesAmount: number
) => {
  let stack: (() => void)[] = [];
  const gridTree: GridTree = { pair: [{}, {}] };

  const nextRoundParticipants = allParticipants.slice(
    currentRoundParticipantsAmount
  );

  const currentRoundParticipants = allParticipants.slice(
    0,
    currentRoundParticipantsAmount
  );
  let exceptCurrentRoundParticipantsAmount =
    2 ** circlesAmount - currentRoundParticipantsAmount;
  const currentDepthLeavesLeftByDepth: number[] = [];

  const fillPairsToDepth = (
    gridTreeNode: GridTree,
    depth: number,
    thisDepth: number,
    canMoveDeeper = true
  ) => {
    const currentDepthLeaves = 2 ** thisDepth;
    currentDepthLeavesLeftByDepth[thisDepth] = currentDepthLeaves;

    if (depth - 1 === thisDepth && nextRoundParticipants.length) {
      gridTreeNode.pair = [
        nextRoundParticipants.length
          ? { userId: nextRoundParticipants.shift() }
          : {},
        nextRoundParticipants.length
          ? { userId: nextRoundParticipants.shift() }
          : {},
      ];
    }

    if (depth === thisDepth) {
      if (exceptCurrentRoundParticipantsAmount > 0) {
        exceptCurrentRoundParticipantsAmount -= 2;
      } else if (currentRoundParticipants.length) {
        gridTreeNode.pair = [
          { userId: currentRoundParticipants.pop() },
          { userId: currentRoundParticipants.pop() },
        ];
      }

      return;
    }

    if (!gridTreeNode.pair) {
      gridTreeNode.pair = [{}, {}];
    }
    stack.push(
      ...gridTreeNode.pair.map((pairEntity) => () => {
        currentDepthLeavesLeftByDepth[thisDepth] -= 1;
        return fillPairsToDepth(
          pairEntity,
          depth,
          thisDepth + 1,
          currentDepthLeavesLeftByDepth[thisDepth] === 0
        );
      })
    );

    if (canMoveDeeper) {
      const functions = stack.slice(0, currentDepthLeaves);
      stack = stack.slice(currentDepthLeaves);
      functions.forEach((f) => f());
    }
  };
  fillPairsToDepth(gridTree, circlesAmount, 1);

  return gridTree;
};

export const changeTreeLeaveWithWinnerId = (
  tree: GridTree,
  winnerId: string
) => {
  const newTree = tree;

  let foundWinner = false;
  const checkTree = (gridTreeNode: GridTree) => {
    if (foundWinner) return;
    if (
      gridTreeNode.pair?.find((pairEntity) => pairEntity.userId === winnerId)
    ) {
      gridTreeNode.userId = winnerId;
      foundWinner = true;
      return;
    }

    gridTreeNode.pair?.forEach((pairEntity) => {
      checkTree(pairEntity);
    });
  };
  checkTree(newTree);

  return newTree;
};

// console.log(
//   JSON.stringify(
//     changeTreeLeaveWithWinnerId(
//       {
//         pair: [
//           {
//             pair: [
//               {
//                 userId: '65b4c7fb00a6728bdeaa8306',
//               },
//               {
//                 userId: '65b4c7fb00a6728bdeaa830b',
//               },
//             ],
//           },
//           {
//             pair: [
//               {
//                 userId: '65b4c7fb00a6728bdeaa830d',
//               },
//               {
//                 pair: [
//                   {
//                     userId: '65b4c7fb00a6728bdeaa8308',
//                   },
//                   {
//                     userId: '65b4c7fb00a6728bdeaa8304',
//                   },
//                 ],
//               },
//             ],
//           },
//         ],
//       },
//       '65b4c7fb00a6728bdeaa8308'
//     ),
//     null,
//     2
//   )
// );

// tests
//
// console.log(
//   JSON.stringify(getPrefilledOlympicGrid(['1', '2', '3'], 2, 2), null, 2)
// );
// console.log(
//   JSON.stringify(
//     getPrefilledOlympicGrid(['1', '2', '3', '4', '5'], 2, 3),
//     null,
//     2
//   )
// );
// console.log(
//   JSON.stringify(
//     getPrefilledOlympicGrid(
//       ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
//       2,
//       4
//     ),
//     null,
//     2
//   )
// );
