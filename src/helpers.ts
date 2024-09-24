export const allEqual = (arr: string[]): boolean => {
  const [first] = arr;
  if (arr.length === 0 || first === undefined) {
    throw new Error("Array can't be empty");
  }
  return arr.every((e) => e === first);
};

export const xDifferByOne = (arr: string[]): boolean => {
  const [first] = arr;
  if (arr.length === 0 || first === undefined) {
    throw new Error("Array can't be empty");
  }
  return arr.every((e, i) => e.charCodeAt(0) - i === first.charCodeAt(0));
};

export const yDifferByOne = (arr: string[]): boolean => {
  const nums = arr.map(Number);
  if (!nums.every(Number.isInteger)) {
    throw new Error(
      "Elements should be of type `${number}`, where n is an integer"
    );
  }
  const [first] = nums;
  if (nums.length === 0 || first === undefined) {
    throw new Error("Array can't be empty");
  }
  return nums.every((e, i) => e - i === first);
};

// Get random int between 0 and max inclusive
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values_inclusive
export function randomInteger(max: number): number {
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored + 1));
}

export const chooseRandomDirection = (): "horizontal" | "vertical" => {
  return Math.floor(Math.random() * 2) ? "horizontal" : "vertical";
};

export const getRowLetter = (width: number): string => {
  let result = "";
  do {
    result = ((width % 26) + 10).toString(36) + result;
    width = Math.floor(width / 26) - 1;
  } while (width >= 0);
  return result.toUpperCase();
};
