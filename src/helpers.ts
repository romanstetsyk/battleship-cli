export const checkIfElementsAreEqual = (array: string[]): boolean => {
  const first = array[0];
  return array.every((e) => e === first);
};

export const checkIfElementsDifferByOne = (array: string[]) => {
  const [first] = array;
  if (!first) throw new Error("array cant be empty");
  return array.every((e, i) => {
    if (!e) return false;
    if (Number.isInteger(+e)) {
      return +e - i === +first;
    } else {
      return e?.charCodeAt(0) - i === first.charCodeAt(0);
    }
  });
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
