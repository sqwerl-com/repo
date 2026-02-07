import ArchivedField from '@/sheets/components/fields/archived-field'
import AuthorsField from '@/sheets/components/fields/authors-field'
import CollectionsField from '@/sheets/components/fields/collections-field'
import DescriptionField from '@/sheets/components/fields/description-field'
import HistoryField from '@/sheets/components/fields/history-field'
import LinksField from '@/sheets/components/fields/links-field'
import LoggerFactory from '@/logger'
import { Picture } from '@/utilities/types'
import PictureOfField from '@/sheets/components/fields/picture-of-field'
import PicturesRepresentationsField from '@/sheets/components/fields/pictures-representations-field'
import ScrollableContent from '@/sheets/components/scrollable-content'
import type { SheetState } from '@/properties'
import ShortDescriptionField from '@/sheets/components/fields/short-description-field'
import TagsField from '@/sheets/components/fields/tags-field'
import TitleBar from '@/sheets/components/title-bar'
import * as React from 'react'

export interface Props {
  state: SheetState
}

/**
 * Renders a read-only form that displays information about pictures of things.
 * @param props
 */
const PicturesSheet = (props: Props): React.JSX.Element => {
  const connectionProperties = ['addedBy', 'archived', 'authors', 'collections', 'links', 'pictureOf', 'tags']
  const logger = loggerFactory.create(PicturesSheet)
  const { state } = props
  const { configuration, thing } = state

  logger.info('Rendering Pictures property sheet')

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
    pictureOf,
    representations,
    shortDescription,
    tags
  }: Picture = thing

  return (
    <>
      <TitleBar
        configuration={configuration}
        connectionProperties={connectionProperties}
        icon=''
        iconDescription=''
        state={state}
        thing={thing}
        titleTextId='picturesSheet.title'
        titleTextValues={{ name }}
      />
      <ScrollableContent>
        {archived && <ArchivedField archived={archived} />}
        {shortDescription && <ShortDescriptionField shortDescription={shortDescription} state={state} />}
        {pictureOf && <PictureOfField things={pictureOf} state={state} />}
        {authors && <AuthorsField authors={authors} state={state} />}
        {description && <DescriptionField description={description} state={state} />}
        {representations &&
          <PicturesRepresentationsField
            fieldTitleId='representations.field.label'
            representations={representations}
            state={state}
          />
        }
        {collections && <CollectionsField collections={collections} state={state} />}
        {tags && <TagsField tags={tags} state={state} />}
        {links && <LinksField links={links} state={state} />}
        {addedOn && <HistoryField addedBy={addedBy} addedOn={addedOn} state={state} />}
      </ScrollableContent>
    </>
  )
}

const loggerFactory = LoggerFactory(PicturesSheet)

export default PicturesSheet
