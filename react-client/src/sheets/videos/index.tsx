import ArchivedField from '../components/fields/archived-field'
import AuthorsField from 'sheets/components/fields/authors-field'
import CollectionsField from 'sheets/components/fields/collections-field'
import DescriptionField from 'sheets/components/fields/description-field'
import FeedsField from 'sheets/components/fields/feeds-field'
import HasViewedField from 'sheets/components/fields/has-viewed-field'
import HistoryField from 'sheets/components/fields/history-field'
import Logger, { LoggerType } from 'logger'
import LinksField from 'sheets/components/fields/links-field'
import NotesField from 'sheets/components/fields/notes-field'
import RecommendationsField from 'sheets/components/fields/recommendations-field'
import RecommendedByField from 'sheets/components/fields/recommended-by-field'
import ScrollableContent from 'sheets/components/scrollable-content'
import type { SheetState } from 'properties'
import TitleBar from 'sheets/components/title-bar'
import TitleField from 'sheets/components/fields/title-field'
import TagsField from 'sheets/components/fields/tags-field'
import ViewedByField from 'sheets/components/fields/viewed-by-field'
import * as React from 'react'

let logger: LoggerType

interface Props {
  state: SheetState
}

/**
 * Renders a read-only form that displays information that describes a video.
 * @param props
 * @constructor
 */
const VideosSheet = (props: Props): React.JSX.Element => {
  logger = Logger(VideosSheet, VideosSheet)
  const connectionProperties = [
    'addedBy',
    'archived',
    'authors',
    'collections',
    'feeds',
    'links',
    'notes',
    'tags',
    'recommendations',
    'recommendedBy',
    'viewedBy'
  ]
  logger.info('Render Videos property sheet')
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
    feeds,
    hasViewed,
    links,
    name,
    notes,
    recommendations,
    recommendedBy,
    tags,
    title,
    url,
    viewedBy
  } = thing
  return (
    <>
      {url &&
        <TitleBar
          configuration={configuration}
          connectionProperties={connectionProperties}
          icon=''
          iconDescription=''
          thing={thing}
          titleTextId='videosSheet.title'
          titleTextValues={{ name, url }}
        />}
      {!url &&
        <TitleBar
          configuration={configuration}
          connectionProperties={connectionProperties}
          icon=''
          iconDescription=''
          thing={thing}
          titleTextId='videosSheet.noUrl.title'
          titleTextValues={{ name, url }}
        />}
      <ScrollableContent>
        {title && <TitleField title={title} />}
        {archived && <ArchivedField archived={archived} />}
        {description && <DescriptionField description={description} state={state} />}
        {hasViewed && <HasViewedField hasViewed={hasViewed} state={state} />}
        {authors && <AuthorsField authors={authors} state={state} />}
        {collections && <CollectionsField collections={collections} state={state} />}
        {feeds && <FeedsField feeds={feeds} state={state} />}
        {notes && <NotesField notes={notes} state={state} />}
        {viewedBy && <ViewedByField state={state} viewedBy={viewedBy} />}
        {recommendedBy && <RecommendedByField recommendedBy={recommendedBy} state={state} />}
        {recommendations && <RecommendationsField recommendations={recommendations} state={state} />}
        {tags && <TagsField state={state} tags={tags} />}
        {links && <LinksField links={links} state={state} />}
        {addedOn && <HistoryField addedBy={addedBy} addedOn={addedOn} state={state} />}
      </ScrollableContent>
    </>
  )
}

export default VideosSheet
