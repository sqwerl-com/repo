type Props = {
  url: string
}

/**
 * Renders an icon that is an HTML anchor (link) to a URL that will open in a new browser tab or window.
 * @param props
 * @constructor
 */
const Index = (props: Props) => {
  const { url } = props
  // TODO - Add ability to add internationalized alt text.
  return (
    <a
      className='sqwerl-properties-open-in-new-tab-or-window-link'
      href={url}
      target='_blank'
    >
      <svg
        className='icon'
        fill='none'
        height='24'
        stroke='currentColor'
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox='0 0 24 24'
        width='24'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    </a>
  )
}

export default Index
