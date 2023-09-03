import ArchivedField from 'sheets/components/fields/archived-field'
import AuthorsField from 'sheets/components/fields/authors-field'
import CollectionsField from 'sheets/components/fields/collections-field'
import DescriptionField from 'sheets/components/fields/description-field'
import FeedsField from 'sheets/components/fields/feeds-field'
import HasReadField from 'sheets/components/fields/has-read-field'
import HistoryField from 'sheets/components/fields/history-field'
import LinksField from 'sheets/components/fields/links-field'
import Logger, { LoggerType } from 'logger'
import NotesField from 'sheets/components/fields/notes-field'
import PictureField from 'sheets/components/fields/picture-field'
import ReadByField from 'sheets/components/fields/read-by-field'
import ReadersField from 'sheets/components/fields/readers-field'
import RecommendationsField from 'sheets/components/fields/recommendations-field'
import RecommendedByField from 'sheets/components/fields/recommended-by-field'
import ScrollableContent from 'sheets/components/scrollable-content'
import type { SheetState } from 'properties'
import TagsField from 'sheets/components/fields/tags-field'
import TitleBar from 'sheets/components/title-bar'
import TitleField from 'sheets/components/fields/title-field'
import { useIntl } from 'react-intl'
import * as React from 'react'

let logger: LoggerType

interface Props {
  state: SheetState
}

/**
 *
 * @param props
 * @constructor
 */
const WebPagesSheet = (props: Props): React.JSX.Element => {
  const connectionProperties = [
    'addedBy',
    'authors',
    'archived',
    'collections',
    'feeds',
    'links',
    'notes',
    'readBy',
    'readers',
    'recommendations',
    'recommendedBy',
    'tags'
  ]
  logger = Logger(WebPagesSheet, WebPagesSheet)
  logger.info('Render Web Pages property sheet')
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
    feeds,
    hasRead,
    links,
    name,
    notes,
    pictures,
    recommendations,
    recommendedBy,
    readBy,
    readers,
    shortDescription,
    tags,
    title,
    url,
    thumbnailUrl
  } = thing
  const pictureFieldTitle = intl.formatMessage({ id: 'webPagesSheet.pictureFieldTitle' })
  return (
    <>
      {url &&
        <TitleBar
          configuration={configuration}
          connectionProperties={connectionProperties}
          icon=''
          iconDescription=''
          thing={thing}
          titleTextId='webPagesSheet.title'
          titleTextValues={{ name, url }}
        />}
      {!url &&
        <TitleBar
          configuration={configuration}
          connectionProperties={connectionProperties}
          icon=''
          iconDescription=''
          thing={thing}
          titleTextId='webPagesSheet.noUrl.title'
          titleTextValues={{ name, url }}
        />}
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
        {title && <TitleField title={title} />}
        {description && <DescriptionField description={description} state={state} />}
        {shortDescription &&
          <div className='sqwerl-properties-read-only-field'>
            <div className='sqwerl-properties-read-only-field-label'>Short description</div>
            <div className='sqwerl-properties-read-only-field-value'>{shortDescription}</div>
          </div>}
        {hasRead && <HasReadField hasRead={hasRead} state={state} />}
        {readers && <ReadersField readers={readers} state={state} />}
        {authors && <AuthorsField authors={authors} state={state} />}
        {feeds && <FeedsField feeds={feeds} state={state} />}
        {collections && <CollectionsField collections={collections} state={state} />}
        {notes && <NotesField notes={notes} state={state} />}
        {readBy && <ReadByField readBy={readBy} state={state} />}
        {recommendedBy && <RecommendedByField recommendedBy={recommendedBy} state={state} />}
        {recommendations && <RecommendationsField recommendations={recommendations} state={state} />}
        {tags && <TagsField state={state} tags={tags} />}
        {links && <LinksField links={links} state={state} />}
        {addedBy && addedOn && <HistoryField addedBy={addedBy} addedOn={addedOn} state={state} />}
      </ScrollableContent>
    </>
  )
}

export default WebPagesSheet
