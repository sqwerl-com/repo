import ArchivedField from '@/sheets/components/fields/archived-field'
import AuthorsField from '@/sheets/components/fields/authors-field'
import CollectionsField from '@/sheets/components/fields/collections-field'
import DescriptionField from '@/sheets/components/fields/description-field'
import HistoryField from '@/sheets/components/fields/history-field'
import LinksField from '@/sheets/components/fields/links-field'
import LoggerFactory from '@/logger'
import NotesField from '@/sheets/components/fields/notes-field'
import PictureField from '@/sheets/components/fields/picture-field'
import ReadersField from '@/sheets/components/fields/readers-field'
import ReadByField from '@/sheets/components/fields/read-by-field'
import RecommendationsField from '@/sheets/components/fields/recommendations-field'
import RecommendedByField from '@/sheets/components/fields/recommended-by-field'
import RepresentationsField from '@/sheets/components/fields/representations-field'
import ScrollableContent from '@/sheets/components/scrollable-content'
import type { SheetState } from '@/properties'
import TagsField from '@/sheets/components/fields/tags-field'
import TitleBar from '@/sheets/components/title-bar'
import TitleField from '@/sheets/components/fields/title-field'
import { useIntl } from 'react-intl'
import * as React from 'react'

export interface Props {
  state: SheetState
}

/**
 * Renders a read-only form that displays information about a document.
 * @param props
 */
const DocumentsSheet = (props: Props): React.JSX.Element => {
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
    'representations',
    'tags'
  ]
  const logger = loggerFactory.create(DocumentsSheet)

  logger.info('Render Documents property sheet')

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
    thumbnailUrl,
    title
  } = thing
  const pictureFieldDescription = intl.formatMessage({ id: 'documentsSheet.pictureFieldDescription' })
  const pictureFieldTitle = intl.formatMessage({ id: 'documentsSheet.pictureFieldTitle' })
  const titleFieldDescription = intl.formatMessage({ id: 'documentsSheet.titleFieldDescription' })

  return (
    <>
      <TitleBar
        configuration={configuration}
        connectionProperties={connectionProperties}
        icon=''
        iconDescription=''
        state={state}
        thing={thing}
        titleTextId='documentsSheet.title'
        titleTextValues={{ name }}
      />
      <ScrollableContent>
        {title && <TitleField description={titleFieldDescription} title={title} />}
        {archived && <ArchivedField archived={archived} />}
        {pictures && pictures.totalCount > 0 &&
          <PictureField
            fieldDescription={pictureFieldDescription}
            fieldTitle={pictureFieldTitle}
            pictures={pictures}
            size='medium'
            state={state}
            thumbnailUrl={thumbnailUrl}
          />}
        {description && <DescriptionField description={description} state={state} />}
        {authors && <AuthorsField authors={authors} state={state} />}
        {representations &&
          <RepresentationsField
            fieldTitleId='representations.field.label'
            representations={representations}
            state={state}
          />
        }
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

const loggerFactory = LoggerFactory(DocumentsSheet)

export default DocumentsSheet
