import ArchivedField from '@/sheets/components/fields/archived-field'
import CollectionsField from '@/sheets/components/fields/collections-field'
import DescriptionField from '@/sheets/components/fields/description-field'
import HistoryField from '@/sheets/components/fields/history-field'
import LinksField from '@/sheets/components/fields/links-field'
import LoggerFactory from '@/logger'
import ProjectStatusField from '@/sheets/components/fields/project-status-field'
import ScrollableContent from '@/sheets/components/scrollable-content'
import type { SheetState } from '@/properties'
import TagsField from '@/sheets/components/fields/tags-field'
import TitleBar from '@/sheets/components/title-bar'
import * as React from 'react'

export interface Props {
  state: SheetState
}

/**
 * Renders a read-only form that displays information about a project.
 * @param props
 */
const ProjectsSheet = (props: Props): React.JSX.Element => {
  const connectionProperties = ['archived', 'collections', 'children', 'links', 'names']
  const logger = loggerFactory.create(ProjectsSheet)
  const { state } = props
  const { configuration, thing } = state

  logger.info('Rendering Projects property sheet')

  if (thing == null) {
    return (<></>)
  }

  const { addedBy, addedOn, archived, collections, description, links, name, status, tags } = thing

  return (
    <>
      <TitleBar
        configuration={configuration}
        connectionProperties={connectionProperties}
        icon=''
        iconDescription=''
        state={state}
        thing={thing}
        titleTextId='projectsSheet.title'
        titleTextValues={{ name }}
      />
      <ScrollableContent>
        {archived && <ArchivedField archived={archived} />}
        {(description !== undefined) && <DescriptionField description={description} state={state} />}
        {status && <ProjectStatusField status={status} /> }
        {(collections !== undefined) && <CollectionsField collections={collections} state={state} />}
        {(tags !== undefined) && <TagsField tags={tags} state={state} />}
        {(links !== undefined) && <LinksField links={links} state={state} />}
        {addedBy && addedOn && <HistoryField addedBy={addedBy} addedOn={addedOn} state={state} />}
      </ScrollableContent>
    </>
  )
}

const loggerFactory = LoggerFactory(ProjectsSheet)

export default ProjectsSheet
