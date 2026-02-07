import ArchivedField from '@/sheets/components/fields/archived-field'
import AuthorsField from '@/sheets/components/fields/authors-field'
import CollectionsField from '@/sheets/components/fields/collections-field'
import DescriptionField from '@/sheets/components/fields/description-field'
import HistoryField from '@/sheets/components/fields/history-field'
import LinksField from '@/sheets/components/fields/links-field'
import LoggerFactory from '@/logger'
import PictureField from '@/sheets/components/fields/picture-field'
import PostsField from '@/sheets/components/fields/posts-field'
import RecommendationsField from '@/sheets/components/fields/recommendations-field'
import RecommendedByField from '@/sheets/components/fields/recommended-by-field'
import ScrollableContent from '@/sheets/components/scrollable-content'
import type { SheetState } from '@/properties'
import SubscribersField from '@/sheets/components/fields/subscribers-field'
import SubscriptionUrlField from '@/sheets/components/fields/subscription-url-field'
import TagsField from '@/sheets/components/fields/tags-field'
import TitleBar from '@/sheets/components/title-bar'
import { useIntl } from 'react-intl'
import WebPageField from '@/sheets/components/fields/web-page-field'
import * as React from 'react'

export interface Props {
  state: SheetState
}

/**
 * Renders a read-only form that displays information about information sources that people can subscribe to.
 * @param props
 */
const SubscriptionsSheet = (props: Props): React.JSX.Element => {
  const connectionProperties = [
    'addedBy',
    'archived',
    'authors',
    'collections',
    'links',
    'posts',
    'recommendations',
    'recommendedBy',
    'subscribers',
    'subscriptionUrl',
    'tags',
    'webPage'
  ]
  const logger = loggerFactory.create(SubscriptionsSheet)

  logger.info('Render Subscriptions property sheet')

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
    pictures,
    posts,
    recommendations,
    recommendedBy,
    subscribers,
    subscriptionUrl,
    tags,
    thumbnailUrl,
    webPage
  } = thing
  const pictureFieldDescription = intl.formatMessage({ id: 'subscriptionsSheet.pictureFieldDescription' })
  const pictureFieldTitle = intl.formatMessage({ id: 'subscriptionsSheet.pictureFieldTitle' })
  const webPageFieldDescription = intl.formatMessage({ id: 'subscriptionsSheet.webPageFieldDescription' })

  return (
    <>
      <TitleBar
        configuration={configuration}
        connectionProperties={connectionProperties}
        icon=''
        iconDescription=''
        state={state}
        thing={thing}
        titleTextId='subscriptionsSheet.title'
        titleTextValues={{ name }}
      />
      <ScrollableContent>
        {archived && <ArchivedField archived={archived} />}
        {pictures &&
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
        {collections && <CollectionsField collections={collections} state={state} />}
        {posts && <PostsField posts={posts} state={state} />}
        {webPage && <WebPageField description={webPageFieldDescription} webPage={webPage} state={state} />}
        {recommendedBy && <RecommendedByField recommendedBy={recommendedBy} state={state} />}
        {recommendations && <RecommendationsField recommendations={recommendations} state={state} />}
        {tags && <TagsField tags={tags} state={state} />}
        {links && <LinksField links={links} state={state} />}
        {subscribers && <SubscribersField state={state} subscribers={subscribers} />}
        {subscriptionUrl &&
          <SubscriptionUrlField
            descriptionId='subscriptionUrl.description'
            labelId='subscriptionUrl.label'
            state={state}
            url={subscriptionUrl}
          />
        }
        {addedBy && addedOn && <HistoryField addedBy={addedBy} addedOn={addedOn} state={state} />}
      </ScrollableContent>
    </>
  )
}

const loggerFactory = LoggerFactory(SubscriptionsSheet)

export default SubscriptionsSheet
