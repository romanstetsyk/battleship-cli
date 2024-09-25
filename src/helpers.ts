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
      'Elements should be of type `${number}`, where n is an integer',
    );
  }
  const [first] = nums;
  if (nums.length === 0 || first === undefined) {
    throw new Error("Array can't be empty");
  }
  return nums.every((e, i) => e - i === first);
};

export const getRowLetter = (width: number): string => {
  let result = '';
  do {
    result = ((width % 26) + 10).toString(36) + result;
    width = Math.floor(width / 26) - 1;
  } while (width >= 0);
  return result.toUpperCase();
};

export const randomElement = <T>(array: T[]): T => {
  const elem = array[Math.floor(Math.random() * array.length)];
  if (!elem) {
    throw new Error('Random element error');
  }
  return elem;
};
