import _ from "lodash-es";

/**
 * @param arr
 * @returns A random element from the given array, or undefined if the array is empty
 */
const randFromArray = <T>(arr: T[]): T | undefined =>
  arr[_.random(0, arr.length - 1)];

export default randFromArray;
