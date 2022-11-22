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
