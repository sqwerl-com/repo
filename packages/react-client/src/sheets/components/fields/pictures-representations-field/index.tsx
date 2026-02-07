import { CollectionType, Thing } from '@/utilities/types'
import Field from '@/sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import OpenInNewTabOrWindowLink from '@/sheets/components/open-in-new-tab-or-window-link'
import type { SheetState } from '@/properties'
import * as React from 'react'

export interface Props {
  fieldTitleId: string
  representations: CollectionType<Thing>
  state: SheetState
}

/**
 * Renders a read-only field that contains links to images.
 * @param props
 */
const PicturesRepresentationsField = (props: Props): React.JSX.Element => {
  const { fieldTitleId, representations, state } = props
  const intl = useIntl()

  return (
    <Field
      collection={representations}
      createLink={representationLink}
      fieldLabel={intl.formatMessage({ id: fieldTitleId }, { count: representations.totalCount })}
      property='representations'
      state={state}
    />
  )
}

/**
 * Renders a hyperlink to a thing's digital representation.
 * @param intl Internalization information.
 * @param representation
 */
const representationLink = (intl: IntlShape, representation: Thing): React.JSX.Element => {
  const { href, name, title } = representation
  const label = getLabel(intl, href, name, title);

  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <a className='sqwerl-hyperlink-underline-on-hover' href={href}>{label}</a>
      <OpenInNewTabOrWindowLink url={href} />
    </span>
  )
}

/**
 * Returns the text to label a link to an image with.
 * @param intl Internalization information.
 * @param href URL for an image file.
 * @param name Name for an image file.
 * @param title Title for an image file.
 */
const getLabel = (intl: IntlShape, href: string, name: string, title: string): string => {
  if (name.length > 0) {
    return getSizeLabel(intl, name)
  } else if (href.length > 0) {
    return getSizeLabel(intl, href)
  }

  return title
}

/**
 * Returns text for labeling an image that refers to the image's size.
 * @param intl Internalization information.
 * @param text Text that may contain information about an image's size.
 */
const getSizeLabel = (intl: IntlShape, text: string): string => {
  if (text.lastIndexOf('_small') !== -1) {
    return intl.formatMessage({ id: 'small'});
  } else if (text.lastIndexOf('_medium') !== -1) {
    return intl.formatMessage({ id: 'medium' })
  } else if (text.lastIndexOf('_preview') !== -1) {
    return intl.formatMessage({ id: 'preview' })
  } else if (text.lastIndexOf('_large') !== -1) {
    return intl.formatMessage({ id: 'large' })
  }

  return ''
}

export default PicturesRepresentationsField
