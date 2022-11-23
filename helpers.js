export const checkIfElementsAreEqual = array => {
  return array.every(e => e === array[0]);
};

export const checkIfElementsDifferByOne = array => {
  /**
   * Works for integers and letters
   */
  return array.every((e, i) => {
    if (!e) return false;
    if (Number.isInteger(+e)) {
      return +e - i === +array[0];
    } else {
      return e?.charCodeAt() - i === array[0].charCodeAt();
    }
  });
};

export const randomInteger = upperLimit => {
  /**
   * Returns a random number between 0 and upperLimit inclusive
   * @param number upperLimit - positive integer
   * @return number - a random number between 0 and upperLimit inclusive
   */
  return Math.floor(Math.random() * (upperLimit + 1));
};

export const chooseRandomDirection = () => {
  return randomInteger(1) ? "horizontal" : "vertical";
};
