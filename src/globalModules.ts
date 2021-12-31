/**
 * This adds all the stuff to the global object so that it can be accessed from inside MZ
 */

export default function addToWindow(key: string, item: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
  // Add to window
  if (!window.$pmz) {
    (window as any).$pmz = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
  }
  if ((window as any).$pmz[key]) {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    throw Error(`Key ${key} is already defined on window`);
  }
  (window as any).$pmz[key] = item; // eslint-disable-line @typescript-eslint/no-explicit-any
}
