import ArchivedField from '../components/fields/archived-field'
import AuthorsField from 'sheets/components/fields/authors-field'
import CollectionsField from 'sheets/components/fields/collections-field'
import DescriptionField from 'sheets/components/fields/description-field'
import EpisodesField from 'sheets/components/fields/episodes-field'
import HistoryField from 'sheets/components/fields/history-field'
import LinksField from 'sheets/components/fields/links-field'
import Logger, { LoggerType } from 'logger'
import RecommendationsField from 'sheets/components/fields/recommendations-field'
import RecommendedByField from 'sheets/components/fields/recommended-by-field'
import ScrollableContent from 'sheets/components/scrollable-content'
import type { SheetState } from 'properties'
import TagsField from 'sheets/components/fields/tags-field'
import TitleBar from 'sheets/components/title-bar'
import WebPageField from 'sheets/components/fields/web-page-field'
import * as React from 'react'

let logger: LoggerType

interface Props {
  state: SheetState
}

/**
 * Renders a read-only form that displays information about a podcast.
 * @param {Props} props
 * @returns {JSX.Element}
 * @constructor
 */
const PodcastsSheet = (props: Props): React.JSX.Element => {
  logger = Logger(PodcastsSheet, PodcastsSheet)
  /* TODO - If the podcast has a web page add one to the connection count. */
  const connectionProperties = [
    'addedBy',
    'archived',
    'authors',
    'collections',
    'episodes',
    'links',
    'listeners',
    'recommendations',
    'recommendedBy',
    'tags'
  ]
  logger.info('Render Podcasts property sheet')
  const { state } = props
  const { configuration, thing } = state
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
    episodes,
    links,
    name,
    recommendations,
    recommendedBy,
    tags,
    webPage
  } = thing
  return (
    <>
      <TitleBar
        configuration={configuration}
        connectionProperties={connectionProperties}
        icon=''
        iconDescription=''
        thing={thing}
        titleTextId='podcastsSheet.title'
        titleTextValues={{ name }}
      />
      <ScrollableContent>
        {archived && <ArchivedField archived={archived} />}
        {description && <DescriptionField description={description} state={state} />}
        {authors && <AuthorsField authors={authors} state={state} />}
        {collections && <CollectionsField collections={collections} state={state} />}
        {episodes && <EpisodesField episodes={episodes} state={state} />}
        {webPage && <WebPageField state={state} webPage={webPage} />}
        {recommendedBy && <RecommendedByField recommendedBy={recommendedBy} state={state} />}
        {recommendations && <RecommendationsField recommendations={recommendations} state={state} />}
        {links && <LinksField links={links} state={state} />}
        {tags && <TagsField state={state} tags={tags} />}
        {addedBy && addedOn && <HistoryField addedBy={addedBy} addedOn={addedOn} state={state} />}
      </ScrollableContent>
    </>
  )
}

export default PodcastsSheet
