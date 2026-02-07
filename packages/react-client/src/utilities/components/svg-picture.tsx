import { useEffect, useState } from 'react'

interface Props {
  className: string
  href: string
}

/**
 * Renders an SVG image.
 * @param props
 * @constructor
 */
const SVGPicture = (props: Props) => {
  const { className, href } = props

  // TODO - The URL has a different port (6719) than the one this UI is served on (3333) which causes
  // a CORS error. This needs to not occur. See how its handled by the fetcher component.
  const alteredHref = href.replace(/6719/, '3333')

  /*
  return (
    <object className={`${className} sqwerl-navigation-item-icon`} data={alteredHref} type='image/svg+xml' />
  )
  */
  const [content, setContent] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (content === undefined) {
      // TODO - The URL has a different port (6719) than the one this UI is served on (3333) which causes
      // a CORS error. This needs to not occur. See how its handled by the fetcher component.
      const alteredHref = href.replace(/6719/, '3333')

      fetch(alteredHref).then(async (result) => {
        const text = await result.text();
        setContent(text)
      })
    }
  }, [content])

  return (
    <>
      {content === undefined &&
        <span className={`${className} sqwerl-navigation-item-icon loading`} data-testid={className} />
      }
      {/* // TODO - make sure content contains a valid XML document, with an SVG root element (avoid HTML injection attack) */}
      {content !== undefined &&
        <span className={className} dangerouslySetInnerHTML={{ __html: content ?? '' }} data-testid={className} />
      }
    </>
  )
}

export default SVGPicture
