/**
 * Returns the default width and height (in pixels) for picture with the given size name.
 * @param size The name for a size of picture. For example: small, medium, large.
 */
const defaultImageSize = (size: string): { height: number, width: number } => {
  let height = 260
  let width = 180
  if (size === 'small') {
    width = 38
    height = 50
  } else if (size === 'large') {
    width = 300
    height = 450
  }
  return { height, width }
}

export default defaultImageSize

