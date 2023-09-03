import UrlBuilder from 'sheets/components/url-builder'

it('renders without crashing', () => {
  UrlBuilder('', () => {});
})
