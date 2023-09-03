import { BasicThing, CollectionType, Thing } from 'utils/types'
import defaultImageSize from 'utils/default-image-size'
import type { SheetState } from 'properties'
import { useEffect, useState } from 'react'
import * as React from 'react'

interface Props {
  fieldTitle: string
  pictures: CollectionType<BasicThing>
  size: string
  state: SheetState,
  thumbnailUrl?: string
}

/**
 * Renders a read-only field that displays a picture of a thing.
 * @param props
 * @constructor
 */
const PictureField = (props: Props): React.JSX.Element => {
  const { fieldTitle, pictures, size, state, thumbnailUrl } = props
  const { isBusy, logger } = state
  logger.setContext(PictureField)
  const [picture, setPicture] = useState<BasicThing | null>(null)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [isThumbnailLoaded, setIsThumbnailLoaded] = useState(false)
  useEffect(() => {
    setIsImageLoaded(false)
    setIsThumbnailLoaded(false)
    setPicture(null)
    const fetchData = async () => {
      // Retrieve the definitions of the picture's digital representations (images).
      const data = await fetchRepresentations(props)
      if (data && {}.hasOwnProperty.call(data, 'representations')) {
        const representations: CollectionType<Thing> = data.representations
        const pictures: BasicThing[] = representations.members
        const count = data.representations.totalCount
        let picture = null
        let previewPicture = null

        // If there is only one image that represents the picture, use that image.
        if (count === 1) {
          picture = pictures[0]
        } else if (count > 0) {

          // If there are more than one representation for the picture, and the name of the size for the desired
          // representation was given, then look for a representation that matches the requested size
          if (size && count > 1) {
            const images = pictures.filter(r => r.name ? r.name.toLowerCase().includes(size.toLowerCase()) : false)
            if (images.length === 1) {
              picture = images[0]
            }
          }

          // Choose the representation with no specified size.
          if ((picture === null) && (count > 1)) {
            const images = pictures.filter(r => r.name.toLowerCase() === r.name)
            if (images.length > 0) {
              picture = images[0]
            }
          }

          // If there is only one representation, use it.
          if ((picture === null) && (count === 1)) {
            picture = pictures[0]
          }
        }
        setPicture(picture)
      }
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pictures])
  return (
      <div className='sqwerl-properties-read-only-field'>
        <div className='sqwerl-properties-read-only-field-label'>{fieldTitle}</div>
        <div className='sqwerl-properties-read-only-field-value'>
          {render(
            picture, size, isImageLoaded, isThumbnailLoaded, setIsImageLoaded, setIsThumbnailLoaded, thumbnailUrl)
          }
        </div>
      </div>
  )
}

/**
 * Retrieves things that are a picture's corresponding digital representations (images).
 * @param props
 */
const fetchRepresentations = async (props: Props) => {
  const { pictures, state } = props
  const { configuration, fetcher, logger } = state
  logger.setContext(fetchRepresentations)
  if (pictures && pictures.totalCount > 0) {
    const response = await fetcher.requestData({
      url: `${configuration.baseUrl}${pictures.members[0].id}`.replace(/ /g, '-')
    })
    if (response.status === 200) {
      return await response.json()
    } else {
      logger.error(`Failed to retrieve the picture with the url "${response.url}"\n` +
        `Error code: ${response.status}\n` +
        `Error message: "${response.statusText}"`)
      // TODO - Handle error.
    }
    return null
  }
}

/**
 * Renders an HTML image for the given picture.
 * @param picture Data that describes a digital image.
 * @param size The name for the image's size. For example: small, medium, or large.
 * @param isImageLoaded Has the picture's image data been loaded?
 * @param isThumbnailLoaded Has a thumbnail (preview) image data been loaded?
 * @param setIsImageLoaded Sets that the picture's image data has been downloaded.
 * @param setIsThumbnailLoaded Sets that a thumbnail (preview) image's data has been downloaded.
 * @param thumbnailUrl URL to a small preview image that can be displayed as a placeholder until the larger image has
 *                     been downloaded.
 */
const render = (
  picture: BasicThing | null,
  size: string,
  isImageLoaded: boolean,
  isThumbnailLoaded: boolean,
  setIsImageLoaded: (isLoaded: boolean) => void,
  setIsThumbnailLoaded: (isLoaded: boolean) => void,
  thumbnailUrl?: string) => {
  const { height, width } = defaultImageSize(size)
  const hideLoadingAnimation = isImageLoaded
  const showThumbnail = isThumbnailLoaded && (!isImageLoaded)

  // If we have a thumbnail (preview) image, then when that image's data has been downloaded display the preview image.
  // When the actual image's data has been downloaded, display that image and stop showing the loading animation.
  return (
    <>
      <div
        className='sqwerl-loading-picture-preview-container'
        style={{ height:`${height}px`, width: `${width}px` }}
      >
        {thumbnailUrl &&
          <img
            className={`sqwerl-loading-picture-preview ${showThumbnail ? 'visible' : 'hidden'}`}
            onLoad={() => {
              setIsThumbnailLoaded(true)
            }}
            src={thumbnailUrl}
          />
        }
        {!thumbnailUrl &&
          <img
            className={`sqwerl-loading-picture-preview ${showThumbnail ? 'visible' : 'hidden'}`}
            onLoad={() => {
              setIsThumbnailLoaded(true)
            }}
          />
        }
        <img
          className={`sqwerl-picture ${(picture && isImageLoaded) ? 'loaded' : 'loading'}`}
          onLoad={() =>
            setIsImageLoaded(true)
          }
          src={picture?.href || ''}
          style={{ height: `${height}px`, width: `${width}px` }}
        />
        <div
          className={`sqwerl-loading-picture-animation ${hideLoadingAnimation ? 'hidden' : 'visible'}`}
        />
      </div>
    </>
  )
}

export default PictureField
