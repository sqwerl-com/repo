import { HasPictureData, PictureData } from '@/utilities/types'
import SVGPicture from '@/utilities/components/svg-picture'

// TODO - The default pictures for a type of thing is specified in the type's definition, the server
// should return this information with the right url prefix ({server}/{application name}/{repository name}/{id}/representation}.
export const defaultIcons = {
  '/types': {
    'href': '/sqwerl/Main/types/pictures/Types/folder.svg/representation',
    'name': 'folder.svg'
  },
  '/types/accounts': {
    'href': '/sqwerl/Main/types/pictures/Accounts/lock.svg/representation',
    'name': 'lock.svg'
  },
  '/types/books': {
    'href': '/sqwerl/Main/types/pictures/Books/book.svg/representation',
    'name': 'book.svg'
  },
  '/types/collections': {
    'href': '/sqwerl/Main/types/pictures/Collections/folder.svg/representation',
    'name': 'folder.svg'
  },
  '/types/contributors': {
    'href': '/sqwerl/Main/types/pictures/Contributors/users.svg/representation',
    'name': 'users.svg'
  },
  '/types/documents': {
    'href': '/sqwerl/Main/types/pictures/Documents/document.svg/representation',
    'name': 'document.svg'
  },
  '/types/pictures': {
    'href': '/sqwerl/Main/types/pictures/Pictures/image.svg/representation',
    'name': 'image.svg'
  },
  '/types/collections/Projects': {
    'href': '/sqwerl/Main/types/pictures/Projects/list.svg/representation',
    'name': 'list.svg'
  },
  '/types/podcasts': {
    'href': '/sqwerl/Main/types/pictures/Podcasts/mic.svg/representation',
    'name': 'mic.svg'
  },
  '/types/repositories': {
    'href': '/sqwerl/Main/types/pictures/Repositories/repository.svg/representation',
    'name': 'repository.svg'
  },
  '/types/subscriptions': {
    'href': '/sqwerl/Main/types/pictures/Subscriptions/rss.svg/representation',
    'name': 'rss.svg'
  },
  '/types/tags': {
    'href': '/sqwerl/Main/types/pictures/Tags/tag.svg/representation',
    'name': 'tag.svg'
  },
  '/types/videos': {
    'href': '/sqwerl/Main/types/pictures/Videos/film.svg/representation',
    'name': 'film.svg'
  }
}

/* Thumbnail image sizes */
export const SIZES = {
  large: 'large',
  medium: 'medium',
  small: 'small'
}

export interface Props {
  depictable: undefined | HasPictureData
  size: string
  typeId: string | undefined
}

/**
 * Renders a small thumbnail image that represents a thing if the thing has such an image.
 * @param props
 */
const ThumbnailImage = (props: Props) => {
  const { depictable, size, typeId } = props
  let picture: PictureData | undefined

  depictable?.pictureData?.forEach((data) => {
    if (picture === undefined && data.name?.includes(size)) {
      picture = data
    }
  })

  if ((picture === undefined) && (typeId !== undefined)) {
    picture = (defaultIcons as any)[typeId] as PictureData
  }

  const className = `sqwerl-${size}-thumbnail-image`
  let href = undefined

  if (picture !== undefined) {
    href = picture.href
  } else if ((depictable?.pictureData && depictable.pictureData.length > 0)) {
    href = depictable.pictureData[0].href
  }

  if (href !== undefined) {
    if (/\.svg/.test(href)) {
      return (<SVGPicture className={`${className} sqwerl-svg-thumbnail`} href={href} />)
    } else {
      return (<img className={className} data-testid={className} src={href} />)
    }
  }

  return (<></>)
}

export default ThumbnailImage
