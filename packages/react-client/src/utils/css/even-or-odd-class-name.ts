/**
 * Returns a CSS class name to add to HTML elements to distinguish the even and odd elements within a list
 * @param index An HTML element's index within a list of HTML elements.
 */
export const evenOrOddClassName = (index: number): string => {
  return ((index % 2) === 0) ? 'even' : 'odd'
}
