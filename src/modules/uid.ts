import _ from "lodash-es";

/**
 * Handles generating unique identifiers
 */

/**
 * Trainer IDs are just a 14 digit number from 0 to 999999999999
 * The last 6 digits are 'displayed'
 * @returns 
 */
export const generateId = () => _.random(0, 99999999999999);
