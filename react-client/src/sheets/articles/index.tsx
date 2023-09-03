import ArchivedField from '../components/fields/archived-field'
import AuthorsField from 'sheets/components/fields/authors-field'
import CollectionsField from 'sheets/components/fields/collections-field'
import HistoryField from 'sheets/components/fields/history-field'
import LinksField from 'sheets/components/fields/links-field'
import Logger, { LoggerType } from 'logger'
import NotesField from 'sheets/components/fields/notes-field'
import PictureField from 'sheets/components/fields/picture-field'
import ReadByField from 'sheets/components/fields/read-by-field'
import ReadersField from 'sheets/components/fields/readers-field'
import RecommendationsField from 'sheets/components/fields/recommendations-field'
import RecommendedByField from 'sheets/components/fields/recommended-by-field'
import RepresentationsField from 'sheets/components/fields/representations-field'
import ScrollableContent from 'sheets/components/scrollable-content'
import type { SheetState } from 'properties'
import TagsField from 'sheets/components/fields/tags-field'
import TitleBar from 'sheets/components/title-bar'
import { useIntl } from 'react-intl'
import * as React from 'react'

let logger: LoggerType

interface Props {
  state: SheetState
}

/**
 * Renders a read-only form that displays information about an article.
 * @param {Props} props
 * @returns {JSX.Element}
 * @constructor
 */
const ArticlesSheet = (props: Props): React.JSX.Element => {
  logger = Logger(ArticlesSheet, ArticlesSheet)
  const connectionProperties = [
    'addedBy',
    'archived',
    'authors',
    'collections',
    'links',
    'notes',
    'pictures',
    'readBy',
    'readers',
    'recommendations',
    'recommendedBy',
    'representations',
    'tags'
  ]
  logger.info('Rendering Articles property sheet')
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
    links,
    name,
    notes,
    pictures,
    readBy,
    readers,
    recommendations,
    recommendedBy,
    representations,
    tags,
    thumbnailUrl
  } = thing
  const pictureFieldTitle = intl.formatMessage({ id: 'articlesSheet.pictureFieldTitle' })
  return (
    <>
      <TitleBar
        configuration={configuration}
        connectionProperties={connectionProperties}
        icon=''
        iconDescription=''
        thing={thing}
        titleTextId='articlesSheet.title'
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
        {authors && <AuthorsField authors={authors} state={state} />}
        {collections && <CollectionsField collections={collections} state={state} />}
        {representations &&
          <RepresentationsField
            fieldTitleId='representations.field.label'
            representations={representations}
            state={state}
          />}
        {notes && <NotesField notes={notes} state={state} />}
        {readBy && <ReadByField readBy={readBy} state={state} />}
        {readers && <ReadersField readers={readers} state={state} />}
        {recommendedBy && <RecommendedByField recommendedBy={recommendedBy} state={state} />}
        {recommendations && <RecommendationsField recommendations={recommendations} state={state} />}
        {tags && <TagsField tags={tags} state={state} />}
        {links && <LinksField links={links} state={state} />}
        {addedBy &&
          addedOn &&
            <HistoryField addedBy={addedBy} addedOn={addedOn} state={state} />}
      </ScrollableContent>
    </>
  )
}

export default ArticlesSheet
