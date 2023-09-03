import ArchivedField from '../components/fields/archived-field'
import AuthorsField from '../components/fields/authors-field'
import CollectionsField from '../components/fields/collections-field'
import DescriptionField from '../components/fields/description-field'
import HistoryField from '../components/fields/history-field'
import LinksField from '../components/fields/links-field'
import Logger, { LoggerType } from 'logger'
import PictureField from '../components/fields/picture-field'
import ScrollableContent from 'sheets/components/scrollable-content'
import RecommendationsField from '../components/fields/recommendations-field'
import RecommendedByField from '../components/fields/recommended-by-field'
import type { SheetState } from 'properties'
import TagsField from '../components/fields/tags-field'
import TitleBar from 'sheets/components/title-bar'
import UrlField from 'sheets/components/fields/url-field'
import { useIntl } from 'react-intl'
import WebPageField from '../components/fields/web-page-field'
import * as React from 'react'

let logger: LoggerType

interface Props {
  state: SheetState
}

/**
 * Renders a read-only form that displays information about an RSS feed.
 * @param props
 * @constructor
 */
const FeedsSheet = (props: Props): React.JSX.Element => {
  logger = Logger(FeedsSheet, FeedsSheet)
  const connectionProperties = [
    'addedBy',
    'authors',
    'collections',
    'feedUrl',
    'links',
    'recommendations',
    'recommendedBy',
    'tags',
    'webPage'
  ]
  logger.info('Render Feeds property sheet')
  const { state } = props
  const { configuration, thing } = state
  const intl = useIntl()
  if (thing == null) {
    return (<></>)
  }
  const {
    addedBy,
    addedOn,
    archived,
    authors,
    collections,
    description,
    feedUrl,
    links,
    name,
    pictures,
    recommendations,
    recommendedBy,
    tags,
    thumbnailUrl,
    webPage
  } = thing
  const pictureFieldTitle = intl.formatMessage({ id: 'feedsSheet.pictureFieldTitle' })
  return (
    <>
      <TitleBar
        configuration={configuration}
        connectionProperties={connectionProperties}
        icon=''
        iconDescription=''
        thing={thing}
        titleTextId='feedsSheet.title'
        titleTextValues={{ name }}
      />
      <ScrollableContent>
        {archived && <ArchivedField archived={archived} />}
        {pictures &&
          <PictureField
            fieldTitle={pictureFieldTitle}
            pictures={pictures}
            size='medium'
            state={state}
            thumbnailUrl={thumbnailUrl}
          />}
        {description && <DescriptionField description={description} state={state} />}
        {authors && <AuthorsField authors={authors} state={state} />}
        {collections && <CollectionsField collections={collections} state={state} />}
        {webPage && <WebPageField webPage={webPage} state={state} />}
        {recommendedBy && <RecommendedByField recommendedBy={recommendedBy} state={state} />}
        {recommendations && <RecommendationsField recommendations={recommendations} state={state} />}
        {tags && <TagsField tags={tags} state={state} />}
        {links && <LinksField links={links} state={state} />}
        {feedUrl && <UrlField labelId='feedUrl.label' url={feedUrl} state={state} />}
        {addedBy && addedOn && <HistoryField addedBy={addedBy} addedOn={addedOn} state={state} />}
      </ScrollableContent>
    </>
  )
}

export default FeedsSheet
