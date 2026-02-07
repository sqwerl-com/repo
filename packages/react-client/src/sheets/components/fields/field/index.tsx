import ApplicationContext from '@/context/application'
import { BasicThing, CollectionType, HasPictureData, PictureData } from '@/utilities/types'
import { ChevronRight } from 'react-feather'
import { encodeUriReplaceStringsWithHyphens } from '@/utilities/formatters/ids.ts'
import { IntlShape, useIntl } from 'react-intl'
import IsThingOfType from '@/sheets/components/is-thing-of-type'
import IsTypeOfThing from '@/sheets/components/is-type-of-thing'
import { Link } from 'react-router-dom'
import ReadOnlyFieldLabel from '@/sheets/components/read-only-field-label'
import type { SheetState } from '@/properties'
import type { Thing } from '@/utilities/types'
import ThumbnailImage, { SIZES } from '@/utilities/components/thumbnail-image.tsx'
import { useContext } from 'react'

export type CreateLinkType =
  (intl: IntlShape, thing: Thing, state: SheetState, linkCount?: number) => React.JSX.Element

/**
 * Tne number of values a thing's field can have before we render the field as a link to a new page.
 */
const MAXIMUM_INLINE_MEMBERS = 5

export interface Props {
  /** A collection of things. */
  collection: CollectionType<Thing>

  /** A function to call to render an HTML link to a thing. */
  createLink: CreateLinkType,

  /**
   * Text that describes a field (often displayed within a tooltip).
   */
  fieldDescription?: string,

  /** HTML to label a field's value. */
  fieldLabel: string

  /** The number of members to render as inline links as opposed to a single link to a list of members. */
  maximumInlineMembers?: number

  /** The name of the property whose value this component displays. */
  property: string,

  /** Function that renders inline links for each of a field's values in a list of values. */
  renderMultipleFieldValues?: (
    intl: IntlShape,
    collection: CollectionType<Thing>,
    createLink: CreateLinkType,
    fieldDescription: string | undefined,
    fieldLabel: string,
    state: SheetState
  ) => React.JSX.Element,

  /** Function that renders a single inline link for a field's value. */
  renderSingleFieldValue?: (
    intl: IntlShape,
    member: Thing,
    createLink: CreateLinkType,
    state:SheetState
  ) => React.JSX.Element,

  state: SheetState
}

/**
 * Renders a label and the value of one of a thing's properties. Handles cases where a field's value is a collection
 * of values.
 */
const Field = (props: Props): React.JSX.Element => {
  const {
    collection,
    createLink,
    fieldDescription,
    fieldLabel,
    maximumInlineMembers,
    property,
    renderMultipleFieldValues,
    renderSingleFieldValue = renderSingle,
    state
  } = props
  const { members, totalCount } = collection
  const intl = useIntl()

  return (
    <>
      {collection && (totalCount === 1) &&
        <div className='sqwerl-properties-read-only-field'>
          <ReadOnlyFieldLabel
            description={fieldDescription}
            labelText={fieldLabel}
          />
          {renderSingleFieldValue(intl, members[0], createLink, state)}
        </div>
      }
      {collection && (totalCount > 1) &&
        renderMultiple(
          intl,
          collection,
          maximumInlineMembers ?? 0,
          property,
          fieldDescription,
          fieldLabel,
          createLink,
          renderMultipleFieldValues,
          state
        )
      }
    </>
  )
}

/**
 * Render's a field's value as a hyperlink to a collection of things.
 * @param property The name of the property whose value this component displays.
 * @param fieldLabel HTML to label a field's value.
 * @param state Properties.
 */
const renderFieldAsLink = (property: string, fieldLabel: string, state: SheetState) => {
  return (
    <Link
      className='sqwerl-properties-read-only-field-label-link'
      onClick={() => slideLeft(state)}
      to={`${window.location}.${property}`}
    >
      <span
        className='sqwerl-properties-read-only-label-link-text'
        dangerouslySetInnerHTML={{ __html: fieldLabel }}
        title='This is a title'
      />
      <ChevronRight className='sqwerl-back-or-forward-icon sqwerl-read-only-field-link-chevron' />
    </Link>
  )
}

/**
 * Renders the value of a thing's property (field).
 * @param _intl Internationalization support.
 * @param fieldLabel HTML to label a field's value.
 * @param thing The thing that contains the property that this field displays.
 * @param state Properties.
 */
export const renderFieldValue = (
  _intl: IntlShape, fieldLabel: string, thing: BasicThing, state: SheetState): React.JSX.Element => {
  const { configuration, currentRepositoryName } = state
  const context = useContext(ApplicationContext)
  const { applicationName } = configuration
  const { id, name, type, typeName } = thing
  const isType = {}.hasOwnProperty.call(fieldLabel, 'isType') && thing.isType

  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={`${context.parentThingIdToHref(currentRepositoryName, type)}` +
          `#/${applicationName}/${currentRepositoryName}${encodeUriReplaceStringsWithHyphens(id)}`}
      >
        {name}
        {Object.hasOwn(thing, 'thumbnails') &&
          <ThumbnailImage depictable={thing.thumbnails as HasPictureData} size={SIZES.medium} typeId={thing.type} />
        }
      </Link>
      <span className='sqwerl-read-only-field-sub-item-type-name'>
        {isType ? <IsTypeOfThing /> : <IsThingOfType typeName={typeName} />}
      </span>
    </span>
  )
}

/**
 * Renders multiple field values as inline links.
 * @param intl Internationalization support.
 * @param collection A collection of things.
 * @param createLink A function to call to render an HTML link to a thing.
 * @param fieldLabel HTML to label a field's value.
 * @param state Properties
 */
const renderMultipleInlineFieldValues = (
  intl: IntlShape,
  collection: CollectionType<Thing>,
  createLink: CreateLinkType,
  fieldDescription: string | undefined,
  fieldLabel: string,
  state: SheetState): React.JSX.Element => {
  const items: React.JSX.Element[] = []

  collection.members.forEach((thing, index) => {
    items.push(
      <li className='sqwerl-properties-read-only-field-value-item' key={`multi-field-value-${thing.id}-${index}`}>
        {createLink(intl, thing, state)}
        {Object.hasOwn(thing, 'thumbnails') &&
          <ThumbnailImage
            depictable={{ pictureData: thing.thumbnails } as HasPictureData}
            size={SIZES.medium}
            typeId={thing.typeId}
          />
        }
      </li>)
  })

  return (
    <div className='sqwerl-properties-read-only-field'>
      <ReadOnlyFieldLabel description={fieldDescription} labelText={fieldLabel} />
      <div className='sqwerl-properties-read-only-field-value'>
        <ol className='sqwerl-properties-read-only-field-value-list'>
          {items}
        </ol>
      </div>
    </div>
  )
}

/**
 * Renders a label and multiple values.
 * @param intl Internationalization support.
 * @param collection A collection of things.
 * @param maximumInlineMembers The number of items to display as inline links rather than as a link to a list.
 * @param property The name of the property whose value this component displays.
 * @param fieldDescription Text displayed--typically within a tooltip--to describe a field.
 * @param fieldLabel HTML to label a field's value.
 * @param createLink A function to call to render an HTML link to a thing.
 * @param renderMultipleFieldValues Renders multiple values as inline links.
 * @param state Properties.
 */
const renderMultiple = (
  intl: IntlShape,
  collection: CollectionType<Thing>,
  maximumInlineMembers = MAXIMUM_INLINE_MEMBERS,
  property: string,
  fieldDescription: string | undefined,
  fieldLabel: string,
  createLink: CreateLinkType,
  renderMultipleFieldValues = renderMultipleInlineFieldValues,
  state: SheetState): React.JSX.Element => {
  if (collection.totalCount > maximumInlineMembers) {
    return renderFieldAsLink(property, fieldLabel, state)
  }

  return renderMultipleFieldValues(intl, collection, createLink, fieldDescription, fieldLabel, state)
}

/**
 *
 * @param intl Internationalization support.
 * @param thing
 * @param createLink
 * @param state
 */
const renderSingle = (intl: IntlShape, thing: Thing, createLink: CreateLinkType, state:SheetState) => {
  return (
    <div className="sqwerl-properties-read-only-field-value">
      {createLink(intl, thing, state)}
      <div>
        <ThumbnailImage depictable={{ pictureData: thing.thumbnails } as HasPictureData} size={SIZES.medium} typeId={thing.typeId} />
      </div>
    </div>
  )
}

const slideLeft = (state: SheetState) => {
  const { setAnimationState } = state
  setAnimationState('slide-left')
  setTimeout(() => {
    setAnimationState('')
  }, 300)
}

export default Field
