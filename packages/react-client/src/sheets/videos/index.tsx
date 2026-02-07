import ArchivedField from '@/sheets/components/fields/archived-field'
import AuthorsField from '@/sheets/components/fields/authors-field'
import CollectionsField from '@/sheets/components/fields/collections-field'
import DescriptionField from '@/sheets/components/fields/description-field'
import HasViewedField from '@/sheets/components/fields/has-viewed-field'
import HistoryField from '@/sheets/components/fields/history-field'
import LoggerFactory from '@/logger'
import LinksField from '@/sheets/components/fields/links-field'
import NotesField from '@/sheets/components/fields/notes-field'
import PictureField from '@/sheets/components/fields/picture-field'
import RecommendationsField from '@/sheets/components/fields/recommendations-field'
import RecommendedByField from '@/sheets/components/fields/recommended-by-field'
import ScrollableContent from '@/sheets/components/scrollable-content'
import type { SheetState } from '@/properties'
import SubscriptionsField from '@/sheets/components/fields/subscriptions-field'
import TitleBar from '@/sheets/components/title-bar'
import TitleField from '@/sheets/components/fields/title-field'
import TagsField from '@/sheets/components/fields/tags-field'
import { useIntl } from 'react-intl'
import ViewedByField from '@/sheets/components/fields/viewed-by-field'
import * as React from 'react'

export interface Props {
  state: SheetState
}

/**
 * Renders a read-only form that displays information that describes a video.
 * @param props
 */
const VideosSheet = (props: Props): React.JSX.Element => {
  const connectionProperties = [
    'addedBy',
    'archived',
    'authors',
    'collections',
    'links',
    'notes',
    'tags',
    'recommendations',
    'recommendedBy',
    "subscriptions",
    'viewedBy'
  ]
  const intl = useIntl()
  const logger = loggerFactory.create(VideosSheet)

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
    hasViewed,
    links,
    name,
    notes,
    pictures,
    recommendations,
    recommendedBy,
    subscriptions,
    tags,
    thumbnailUrl,
    title,
    url,
    viewedBy
  } = thing
  const pictureFieldDescription = intl.formatMessage({ id: 'videosSheet.pictureFieldDescription' })
  const pictureFieldTitle = intl.formatMessage({ id: 'videosSheet.pictureFieldTitle' })
  const titleFieldDescription = intl.formatMessage({ id: 'videosSheet.titleFieldDescription' })

  return (
    <>
      {url &&
        <TitleBar
          configuration={configuration}
          connectionProperties={connectionProperties}
          icon=''
          iconDescription=''
          state={state}
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
          state={state}
          thing={thing}
          titleTextId='videosSheet.noUrl.title'
          titleTextValues={{ name, url }}
        />}
      <ScrollableContent>
        {title && <TitleField description={titleFieldDescription} title={title} />}
        {archived && <ArchivedField archived={archived} />}
        {description && <DescriptionField description={description} state={state} />}
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
        {hasViewed && <HasViewedField hasViewed={hasViewed} state={state} />}
        {authors && <AuthorsField authors={authors} state={state} />}
        {collections && <CollectionsField collections={collections} state={state} />}
        {subscriptions && <SubscriptionsField state={state} subscriptions={subscriptions} />}
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

const loggerFactory = LoggerFactory(VideosSheet)

export default VideosSheet
