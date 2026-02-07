import ArchivedField from '@/sheets/components/fields/archived-field'
import AuthorsField from '@/sheets/components/fields/authors-field'
import { Book } from '@/utilities/types'
import CollectionsField from '@/sheets/components/fields/collections-field'
import HistoryField from '@/sheets/components/fields/history-field'
import LinksField from '@/sheets/components/fields/links-field'
import LoggerFactory from '@/logger'
import NotesField from '@/sheets/components/fields/notes-field'
import PictureField from '@/sheets/components/fields/picture-field'
import ReadByField from '@/sheets/components/fields/read-by-field'
import ReadersField from '@/sheets/components/fields/readers-field'
import RecommendationsField from '@/sheets/components/fields/recommendations-field'
import RecommendedByField from '@/sheets/components/fields/recommended-by-field'
import RepresentationsField from '@/sheets/components/fields/representations-field'
import ScrollableContent from '@/sheets/components/scrollable-content'
import type { SheetProps, SheetState } from '@/properties'
import TagsField from '@/sheets/components/fields/tags-field'
import TitleBar from '@/sheets/components/title-bar'
import TitleField from '@/sheets/components/fields/title-field'
import { useIntl } from 'react-intl'
import WebPagesField from '@/sheets/components/fields/web-pages-field'
import * as React from 'react'

export interface Props {
  state: SheetState
}

/**
 * Renders a read-only field that displays information about a book.
 * @param props
 */
const BooksSheet: React.FC<SheetProps> = (props: Props): React.JSX.Element => {
  const connectionProperties = [
    'addedBy',
    'archived',
    'authors',
    'collections',
    'comments',
    'links',
    'notes',
    'readBy',
    'readers',
    'recommendations',
    'recommendedBy',
    'representations',
    'tags'
  ]
  const logger = loggerFactory.create(BooksSheet)

  logger.info('Rendering Books property sheet')

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
    thumbnailUrl,
    title,
    webPages
  }: Book = thing
  const pictureFieldDescription = intl.formatMessage({ id: 'booksSheet.pictureFieldDescription' })
  const pictureFieldTitle = intl.formatMessage({ id: 'booksSheet.pictureFieldTitle' })
  const titleFieldDescription = intl.formatMessage({ id: 'booksSheet.titleFieldDescription' })

  return (
    <>
      <TitleBar
        configuration={configuration}
        connectionProperties={connectionProperties}
        icon=''
        iconDescription=''
        state={state}
        thing={thing}
        titleTextId='booksSheet.title'
        titleTextValues={{ name }}
      />
      <ScrollableContent>
        {archived && <ArchivedField archived={archived} />}
        {pictures && pictures.totalCount > 0 &&
          <PictureField
            fieldDescription={pictureFieldDescription}
            fieldTitle={pictureFieldTitle}
            pictures={pictures}
            size='medium'
            state={state}
            thumbnailUrl={thumbnailUrl}
          />
        }
        {(title !== undefined) && <TitleField description={titleFieldDescription} title={title} />}
        {(authors !== undefined) && <AuthorsField authors={authors} state={state} />}
        {(representations !== undefined) &&
          <RepresentationsField
            fieldTitleId='representations.field.label'
            representations={representations}
            state={state}
          />}
        {(collections !== undefined) && <CollectionsField collections={collections} state={state} />}
        {(notes !== undefined) && <NotesField notes={notes} state={state} />}
        {(readBy !== undefined) && <ReadByField readBy={readBy} state={state} />}
        {(readers !== undefined) && <ReadersField readers={readers} state={state} />}
        {(recommendedBy !== undefined) && <RecommendedByField recommendedBy={recommendedBy} state={state} />}
        {(recommendations !== undefined) && <RecommendationsField recommendations={recommendations} state={state} />}
        {(tags !== undefined) && <TagsField tags={tags} state={state} />}
        {(webPages !== undefined) && <WebPagesField webPages={webPages} state={state} />}
        {(links !== undefined) && <LinksField links={links} state={state} />}
        {addedBy && addedOn && <HistoryField addedBy={addedBy} addedOn={addedOn} state={state} />}
      </ScrollableContent>
    </>
  )
}

const loggerFactory = LoggerFactory(BooksSheet)

export default BooksSheet
