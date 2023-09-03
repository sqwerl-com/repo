import { ChevronRight } from 'react-feather'
import { BasicThing, CollectionType } from 'utils/types'
import { IntlShape, useIntl } from 'react-intl'
import IsThingOfType from 'sheets/components/is-thing-of-type'
import IsTypeOfThing from 'sheets/components/is-type-of-thing'
import { Link } from 'react-router-dom'
import type { SheetState } from 'properties'
import * as React from 'react'

/**
 * Tne number of values a thing's field can have before we render the field as a link to a new page.
 * @type {number}
 */
const MAXIMUM_INLINE_MEMBERS = 5

type Props = {
  /** A collection of things. */
  collection: CollectionType<BasicThing>

  /** The name of the property whose value this component displays. */
  property: string,

  /** HTML to label a field's value. */
  fieldLabel: string,

  /** A function to call to render an HTML link to a thing. */
  createLink: Function,

  state: SheetState
}

/**
 * Renders a label and the value of one of a thing's properties.
 */
const Field = (props: Props): React.JSX.Element => {
  const { collection, createLink, fieldLabel, property, state } = props
  const { members, totalCount } = collection
  const intl = useIntl()
  return (
    <>
      {collection && (totalCount === 1) &&
        <div className='sqwerl-properties-read-only-field'>
          <div
            className='sqwerl-properties-read-only-field-label'
            dangerouslySetInnerHTML={{ __html: fieldLabel }}
          />
          <div className='sqwerl-properties-read-only-field-value'>{createLink(intl, members[0], state)}</div>
        </div>}
      {collection && (totalCount > 1) && renderMultiple(intl, collection, property, fieldLabel, createLink, state)}
    </>
  )
}

/**
 * Render's a field's value as a hyperlink to a collection of things.
 * @param intl Internationalization support.
 * @param collection A collection of things.
 * @param property The name of the property whose value this component displays.
 * @param fieldLabel HTML to label a field's value.
 * @param createLink A function to call to render an HTML link to a thing.
 * @param state Properties.
 */
const renderFieldAsLink = (
  intl: IntlShape,
  collection: CollectionType<BasicThing>,
  property: string,
  fieldLabel: string,
  createLink: Function,
  state: SheetState) => {
  return (
    <a
      className='sqwerl-properties-read-only-field-label-link'
      href={`${window.location}.${property}`}
      onClick={() => slideLeft(state)}
    >
      <span dangerouslySetInnerHTML={{ __html: fieldLabel }} />
      <ChevronRight className='sqwerl-back-or-forward-icon sqwerl-read-only-field-link-chevron' />
    </a>
  )
}

/**
 * Renders the value of a thing's property (field).
 * @param intl Internationalization support.
 * @param fieldLabel HTML to label a field's value.
 * @param thing The thing that contains the property that this field displays.
 * @param state Properties.
 */
export const renderFieldValue = (
  intl: IntlShape, fieldLabel: string, thing: BasicThing, state: SheetState): React.ReactNode => {
  const { configuration, context, currentLibraryName } = state
  const { id, name, type, typeName } = thing
  const isType = {}.hasOwnProperty.call(fieldLabel, 'isType') && thing.isType
  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={`${context.parentThingIdToHref(type)}#/${configuration.applicationName}/` +
          `${currentLibraryName}${context.parentThingIdToHref(id)}`}
      >
        {name}
      </Link>
      <span className='sqwerl-read-only-field-sub-item-type-name'>
        {isType ? <IsTypeOfThing /> : <IsThingOfType typeName={typeName} />}
      </span>
    </span>
  )
}

/**
 * Renders a label and multiple values.
 * @param intl Internationalization support.
 * @param collection A collection of things.
 * @param property The name of the property whose value this component displays.
 * @param fieldLabel HTML to label a field's value.
 * @param createLink A function to call to render an HTML link to a thing.
 * @param state Properties.
 */
const renderMultiple = (
  intl: IntlShape,
  collection: CollectionType<BasicThing>,
  property: string,
  fieldLabel: string,
  createLink: Function,
  state: SheetState) => {
  const items: React.JSX.Element[] = []
  if (collection.totalCount > MAXIMUM_INLINE_MEMBERS) {
    return renderFieldAsLink(intl, collection, property, fieldLabel, createLink, state)
  }
  collection.members.forEach(thing => {
    items.push(
      <li className='sqwerl-properties-read-only-field-value-item' key={thing.id}>
        {createLink(intl, thing, state)}
      </li>)
  })
  return (
    <div className='sqwerl-properties-read-only-field'>
      <div
        className='sqwerl-properties-read-only-field-label'
        dangerouslySetInnerHTML={{ __html: fieldLabel }}
      />
      <div className='sqwerl-properties-read-only-field-value'>
        <ol className='sqwerl-properties-read-only-field-value-list'>
          {items}
        </ol>
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
