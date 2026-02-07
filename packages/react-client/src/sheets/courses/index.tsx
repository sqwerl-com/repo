import ArchivedField from '@/sheets/components/fields/archived-field'
import AttendedByField from '@/sheets/components/fields/attended-by-field'
import AttendingField from '@/sheets/components/fields/attending-field'
import CollectionsField from '@/sheets/components/fields/collections-field'
import DescriptionField from '@/sheets/components/fields/description-field'
import HistoryField from '@/sheets/components/fields/history-field'
import InstructorsField from '@/sheets/components/fields/instructors-field'
import LinksField from '@/sheets/components/fields/links-field'
import LoggerFactory from '@/logger'
import NotesField from '@/sheets/components/fields/notes-field'
import PictureField from '@/sheets/components/fields/picture-field'
import RecommendationsField from '@/sheets/components/fields/recommendations-field'
import RecommendedByField from '@/sheets/components/fields/recommended-by-field'
import RepresentationsField from '@/sheets/components/fields/representations-field'
import ScrollableContent from '@/sheets/components/scrollable-content'
import type { SheetProps } from '@/properties'
import TagsField from '@/sheets/components/fields/tags-field'
import TitleBar from '@/sheets/components/title-bar'
import { useIntl } from 'react-intl'
import * as React from 'react'

/**
 * Renders a read-only form that displays information about an academic course.
 * @param props
 */
const CoursesSheet = (props: SheetProps): React.JSX.Element => {
  const connectionProperties = [
    'addedBy',
    'archived',
    'attendedBy',
    'attending',
    'collections',
    'instructors',
    'links',
    'notes',
    'recommendations',
    'recommendedBy',
    'representations',
    'tags'
  ]
  const intl = useIntl()
  const logger = loggerFactory.create(CoursesSheet)

  logger.info('Rendering Courses property sheet')

  const { state } = props
  const { configuration, thing } = state

  if (thing == null) {
    return (<></>)
  }

  const {
    addedBy,
    addedOn,
    archived,
    attendedBy,
    attending,
    collections,
    description,
    instructors,
    links,
    name,
    notes,
    pictures,
    recommendations,
    recommendedBy,
    representations,
    tags,
    thumbnailUrl
  } = thing
  const pictureFieldDescription = intl.formatMessage({ id: 'coursesSheet.pictureFieldDescription' })
  const pictureFieldTitle = intl.formatMessage({ id: 'coursesSheet.pictureFieldTitle' })

  return (
    <>
      <TitleBar
        configuration={configuration}
        connectionProperties={connectionProperties}
        icon=''
        iconDescription=''
        state={state}
        thing={thing}
        titleTextId='coursesSheet.title'
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
        {description && <DescriptionField description={description} state={state} />}
        {instructors && <InstructorsField instructors={instructors} state={state} />}
        {collections && <CollectionsField collections={collections} state={state} />}
        {representations &&
          <RepresentationsField
            fieldTitleId='representations.field.label'
            representations={representations}
            state={state}
          />
        }
        {notes && <NotesField notes={notes} state={state} />}
        {attendedBy && <AttendedByField attendedBy={attendedBy} state={state} />}
        {attending && <AttendingField attending={attending} state={state} />}
        {recommendedBy && <RecommendedByField recommendedBy={recommendedBy} state={state} />}
        {recommendations && <RecommendationsField recommendations={recommendations} state={state} />}
        {tags && <TagsField tags={tags} state={state} />}
        {links && <LinksField links={links} state={state} />}
        {addedBy && addedOn && <HistoryField addedBy={addedBy} addedOn={addedOn} state={state} />}
      </ScrollableContent>
    </>
  )
}

const loggerFactory = LoggerFactory(CoursesSheet)

export default CoursesSheet
