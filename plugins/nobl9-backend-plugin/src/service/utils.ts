export const groupBy = <T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => string,
) =>
  array.reduce(
    (acc, value, index, arr) => {
      (acc[predicate(value, index, arr)] ||= []).push(value);
      return acc;
    },
    {} as { [key: string]: T[] },
  );
