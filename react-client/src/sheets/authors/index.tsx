import ArchivedField from '../components/fields/archived-field'
import AuthorOfField from 'sheets/components/fields/author-of-field'
import HistoryField from 'sheets/components/fields/history-field'
import InstructedField from 'sheets/components/fields/instructed-field'
import LinksField from 'sheets/components/fields/links-field'
import Logger, { LoggerType } from 'logger'
import PictureField from 'sheets/components/fields/picture-field'
import RecommendationsField from 'sheets/components/fields/recommendations-field'
import ScrollableContent from 'sheets/components/scrollable-content'
import type { SheetState } from 'properties'
import SpokeAtField from 'sheets/components/fields/spoke-at-field'
import TitleBar from 'sheets/components/title-bar'
import TagsField from 'sheets/components/fields/tags-field'
import { useIntl } from 'react-intl'
import * as React from 'react'

let logger: LoggerType

interface Props {
  state: SheetState
}

/**
 * Renders a read-only field that displays information about someone or something that has authored (created) a thing.
 * @param props
 * @constructor
 */
const AuthorsSheet = (props: Props): React.JSX.Element => {
  logger = Logger(AuthorsSheet, AuthorsSheet)
  const connectionProperties = [
    'addedBy', 'archived', 'authorOf', 'instructed', 'linkedInUrl', 'links', 'recommendations', 'spokeAt', 'tags']
  logger.setContext(AuthorsSheet.name).info('Rendering Authors property sheet')
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
  const pictureFieldTitle = intl.formatMessage({ id: 'authorsSheet.pictureFieldTitle' })
  return (
    <>
      <TitleBar
        configuration={configuration}
        connectionProperties={connectionProperties}
        icon=''
        iconDescription=''
        thing={thing}
        titleTextId='authorsSheet.title'
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
        {authorOf && <AuthorOfField authorOf={authorOf} state={state} />}
        {instructed && <InstructedField instructed={instructed} state={state} />}
        {spokeAt && <SpokeAtField spokeAt={spokeAt} state={state} />}
        {recommendations && <RecommendationsField recommendations={recommendations} state={state} />}
        {links && <LinksField links={links} state={state} />}
        {tags && <TagsField tags={tags} state={state} />}
        {addedBy && addedOn && <HistoryField addedBy={addedBy} addedOn={addedOn} state={state} />}
      </ScrollableContent>
    </>
  )
}

export default AuthorsSheet
