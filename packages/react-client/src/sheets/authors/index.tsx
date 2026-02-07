import ArchivedField from '@/sheets/components/fields/archived-field'
import AuthorOfField from '@/sheets/components/fields/author-of-field'
import HistoryField from '@/sheets/components/fields/history-field'
import InstructedField from '@/sheets/components/fields/instructed-field'
import LinksField from '@/sheets/components/fields/links-field'
import LoggerFactory from '@/logger'
import PictureField from '@/sheets/components/fields/picture-field'
import RecommendationsField from '@/sheets/components/fields/recommendations-field'
import ScrollableContent from '@/sheets/components/scrollable-content'
import type { SheetState } from '@/properties'
import SpokeAtField from '@/sheets/components/fields/spoke-at-field'
import TitleBar from '@/sheets/components/title-bar'
import TagsField from '@/sheets/components/fields/tags-field'
import { useIntl } from 'react-intl'
import * as React from 'react'

export interface Props {
  state: SheetState
}

/**
 * Renders a read-only field that displays information about someone or something that has authored (created) a thing.
 * @param props
 */
const AuthorsSheet = (props: Props): React.JSX.Element => {
  const connectionProperties = [
    'addedBy', 'archived', 'authorOf', 'instructed', 'linkedInUrl', 'links', 'recommendations', 'spokeAt', 'tags']
  const logger = loggerFactory.create(AuthorsSheet)
  logger.info('Rendering Authors property sheet')
  const { state } = props
  const intl = useIntl()
  const { configuration, thing } = state

  if (thing == null) {
    return (<></>)
  }

  const {
    addedBy,
    addedOn,
    archived,
    authorOf,
    instructed,
    links,
    name,
    pictures,
    recommendations,
    spokeAt,
    tags,
    thumbnailUrl
  } = thing
  const pictureFieldDescription = intl.formatMessage({ id: 'authorsSheet.pictureFieldDescription' })
  const pictureFieldTitle = intl.formatMessage({ id: 'authorsSheet.pictureFieldTitle' })

  return (
    <>
      <TitleBar
        configuration={configuration}
        connectionProperties={connectionProperties}
        icon=''
        iconDescription=''
        state={state}
        thing={thing}
        titleTextId='authorsSheet.title'
        titleTextValues={{ name }}
      />
      <ScrollableContent>
        {archived && <ArchivedField archived={archived} />}
        {(pictures !== undefined) &&
          <PictureField
            fieldDescription={pictureFieldDescription}
            fieldTitle={pictureFieldTitle}
            pictures={pictures}
            size='medium'
            state={state}
            thumbnailUrl={thumbnailUrl}
          />}
        {(authorOf !== undefined) && <AuthorOfField authorOf={authorOf} state={state} />}

        {/* TODO - Add first name, middle initial, and last name fields. */}
        
        {(instructed !== undefined) && <InstructedField instructed={instructed} state={state} />}
        {(spokeAt !== undefined) && <SpokeAtField spokeAt={spokeAt} state={state} />}
        {(recommendations !== undefined) && <RecommendationsField recommendations={recommendations} state={state} />}
        {(links !== undefined) && <LinksField links={links} state={state} />}
        {(tags !== undefined) && <TagsField tags={tags} state={state} />}
        {addedBy && addedOn && <HistoryField addedBy={addedBy} addedOn={addedOn} state={state} />}
      </ScrollableContent>
    </>
  )
}

const loggerFactory = LoggerFactory(AuthorsSheet)

export default AuthorsSheet
