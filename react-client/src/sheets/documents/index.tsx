import ArchivedField from '../components/fields/archived-field'
import AuthorsField from 'sheets/components/fields/authors-field'
import CollectionsField from 'sheets/components/fields/collections-field'
import DescriptionField from 'sheets/components/fields/description-field'
import HistoryField from 'sheets/components/fields/history-field'
import LinksField from 'sheets/components/fields/links-field'
import Logger, { LoggerType } from 'logger'
import NotesField from 'sheets/components/fields/notes-field'
import ReadersField from 'sheets/components/fields/readers-field'
import ReadByField from 'sheets/components/fields/read-by-field'
import RecommendationsField from 'sheets/components/fields/recommendations-field'
import RecommendedByField from 'sheets/components/fields/recommended-by-field'
import ScrollableContent from 'sheets/components/scrollable-content'
import type { SheetState } from 'properties'
import TagsField from 'sheets/components/fields/tags-field'
import TitleBar from 'sheets/components/title-bar'
import TitleField from 'sheets/components/fields/title-field'
import UrlField from 'sheets/components/fields/url-field'
import * as React from 'react'

let logger: LoggerType

interface Props {
  state: SheetState
}

/**
 * Renders a read-only form that displays information about a document.
 * @param props
 * @constructor
 */
const DocumentsSheet = (props: Props): React.JSX.Element => {
  logger = Logger(DocumentsSheet, DocumentsSheet)
  const connectionProperties = [
    'addedBy',
    'archived',
    'authors',
    'collections',
    'links',
    'notes',
    'readBy',
    'readers',
    'recommendations',
    'recommendedBy',
    'tags'
  ]
  logger.info('Render Documents property sheet')
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
    links,
    name,
    notes,
    readBy,
    readers,
    recommendations,
    recommendedBy,
    tags,
    title,
    url
  } = thing
  return (
    <>
      <TitleBar
        configuration={configuration}
        connectionProperties={connectionProperties}
        icon=''
        iconDescription=''
        thing={thing}
        titleTextId='documentsSheet.title'
        titleTextValues={{ name }}
      />
      <ScrollableContent>
        {title && <TitleField title={title} />}
        {archived && <ArchivedField archived={archived} />}
        {description && <DescriptionField description={description} state={state} />}
        {url && <UrlField labelId='webPage.label' url={url} state={state} />}
        {authors && <AuthorsField authors={authors} state={state} />}
        {collections && <CollectionsField collections={collections} state={state} />}
        {notes && <NotesField notes={notes} state={state} />}
        {readBy && <ReadByField readBy={readBy} state={state} />}
        {readers && <ReadersField readers={readers} state={state} />}
        {recommendedBy && <RecommendedByField recommendedBy={recommendedBy} state={state} />}
        {recommendations && <RecommendationsField recommendations={recommendations} state={state} />}
        {tags && <TagsField tags={tags} state={state} />}
        {links && <LinksField links={links} state={state} />}
        {addedBy && addedOn && <HistoryField addedBy={addedBy} addedOn={addedOn} state={state} />}
      </ScrollableContent>
    </>
  )
}

export default DocumentsSheet
