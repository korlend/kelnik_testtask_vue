/**
 * return function which will call "func" only last called time and not sooner then after "delay"
 * @param func function to call
 * @param delay in milliseconds
 */
export function debounce(func: Function, delay: number) {
  let timeoutId: NodeJS.Timeout | string | number | undefined;

  return (...args: Array<any>) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
