import { CollectionType, Thing } from '@/utils/types'
import type { CreateLinkType } from '@/sheets/components/fields/field'
import Field from '@/sheets/components/fields/field'
import { IntlShape } from 'react-intl'
import ReadOnlyFieldLabel from '@/sheets/components/read-only-field-label'
import type { SheetState } from '@/properties'
import * as React from 'react'

type Props = {
  /** A collection of things. */
  collection: CollectionType<Thing>

  /**
   * The names of the properties of the things whose values are the content for this table field's cells.
   */
  columnProperties: string[],

  /**
   * The titles for this table field's columns.
   */
  columnTitles: string[],

  /** A function to call to render an HTML link to a thing. */
  createLink: CreateLinkType,

  /** HTML to label a field's value. */
  fieldLabel: string,

  /** The name of the property whose value this component displays. */
  property: string,

  state: SheetState
}

/**
 * Renders a label and the values of a thing's properties within an HTML table.
 */
const TableField = (props: Props): React.JSX.Element => {
  const { collection, createLink, fieldLabel, property, state } = props

  return (
    <Field
      collection={collection}
      createLink={createLink}
      fieldLabel={fieldLabel}
      property={property}
      renderMultipleFieldValues={renderMultipleFieldValuesInline}
      state={state}
    />
  )
}

const renderMultipleFieldValuesInline = (
  intl: IntlShape,
  collection: CollectionType<Thing>,
  createLink: CreateLinkType,
  fieldLabel: string,
  state: SheetState) => {
  const rows = collection.members.map((member, index) => {
    return (
      <tr className='sqwerl-table-row-link' key={`table-field-row-${index + 1}`}>
        <td className='sqwerl-properties-table-field-index-column'>
          <span className='sqwerl-properties-table-field-index-column-text'>{index + 1}</span>
        </td>
        <td className='sqwer-properties-table-field-name-column'>
          {createLink(intl, member, state, collection.members.length)}
        </td>
        <td className='sqwerl-properties-table-field-secondary-column'>{member.typeName}</td>
      </tr>
    )
  })
  return (
    <div className='sqwerl-properties-read-only-field'>
      <ReadOnlyFieldLabel labelText={fieldLabel} />
      <div className='sqwerl-properties-read-only-field-value'>
        <table className='sqwerl-properties-table-field'>
          <thead>
            <tr className='sqwerl-properties-table-field-heading'>
              <th className='sqwerl-properties-table-field-index-column'></th>
              <th className='sqwerl-properties-table-field-name-table-heading'>Name</th>
              <th className='sqwerl-properties-table-field-value-table-heading'>Type</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TableField
