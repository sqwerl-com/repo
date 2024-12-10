import { HasPictureData, PictureData } from '@/utils/types'
import * as React from 'react'

type Props = {
  depictable: HasPictureData
}

/**
 * Renders a small thumbnail image that represents a thing if the thing has such an image.
 * @param props
 * @constructor
 */
const SmallThumbnailImage = (props: Props) => {
  const { depictable } = props
  let small: PictureData | undefined;
  depictable.pictureData?.forEach(data => {
    if (data.name.indexOf('small') > -1) {
      small = data
    }
  })
  if (small !== undefined) {
    /* TODO - img HTML tags require an alt attribute that describes the image */
    return (<img className='sqwerl-small-thumbnail-image' src={small.href} />)
  } else if ((depictable.pictureData !== undefined) && (depictable.pictureData.length > 0)) {
    /* TODO - img HTML tags require an alt attribute that describes the image */
    return (<img className='sqwerl-small-thumbnail-image' src={depictable.pictureData[0].href} />)
  }
  return (<></>)
}

export default SmallThumbnailImage
