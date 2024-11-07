export const intersectionWith = <T>(
  first: T[],
  next: T[],
  intersectionFn: (a: T, b: T) => boolean
): T[] =>
  first.filter((item1) => next.find((item2) => intersectionFn(item1, item2)));

export const noIntersectionWith = <T>(
  first: T[],
  next: T[],
  intersectionFn: (a: T, b: T) => boolean
): T[] =>
  first.filter((item1) => !next.find((item2) => intersectionFn(item1, item2)));
