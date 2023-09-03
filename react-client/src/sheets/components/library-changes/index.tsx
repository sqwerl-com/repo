/* global location */

import ApplicationContext, { ApplicationContextType } from 'context/application'
import ChangeLabel from 'sheets/components/change-label'
import { Edit3, HelpCircle, PlusSquare, Trash2 } from 'react-feather'
import { IntlShape, useIntl } from 'react-intl'
import { LibraryChangeDescription } from 'utils/types'
import { linkTargetToCollection, linkTargetToLeaf } from 'utils/formatters/link-target'
import { ReactNode, useContext } from 'react'
import { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  changes: LibraryChangeDescription[]
  offset: number
  state: SheetState
}

interface RenderContext {
  change: LibraryChangeDescription
  context: ApplicationContextType
  index: number
  linkTarget: string
  history: any
  indexColumnWidth: string
  intl: IntlShape
  isCollection: boolean
  multiline: string
  offset: number
  wasRemoved: boolean
}

/**
 * Renders table rows where each row represents a change someone made to a library of things.
 * @param props
 * @constructor
 */
const LibraryChanges = (props: Props): React.JSX.Element => {
  const { changes, offset, state } = props
  const { configuration, currentLibraryName } = state
  const context = useContext(ApplicationContext)
  const intl = useIntl()
  if (changes) {
    const rows: ReactNode[] = []
    changes.forEach((change, index) => {
      const linkTarget =
        (change.isCollection
          ? linkTargetToCollection(change.id, configuration, context, currentLibraryName)
          : linkTargetToLeaf(change.id, configuration, context, currentLibraryName))
      const isCollection = change.typeId === '/types/collections'
      const multiline = isCollection && context.shouldShowPath(change.id) ? 'multiline' : ''
      const indexColumnWidth = `columns-${Math.min(6, Math.round(Math.log10(changes.length) + 1))}`
      const renderContext: RenderContext = {
        change,
        context,
        index,
        linkTarget,
        history,
        indexColumnWidth,
        intl,
        isCollection,
        multiline,
        offset,
        wasRemoved: change.typeOfChange === 'removed'
      }
      rows.push(renderChangeRow(renderContext))
    })
    return (<>{rows}</>)
  }
  return (<></>)
}

/**
 * Renders a table row that describes a thing that has been changed.
 * @param renderContext Information required to describe changes made to a thing.
 */
const renderChangeRow = (renderContext: RenderContext) => {
  const {
    change,
    context,
    index,
    linkTarget,
    indexColumnWidth,
    intl,
    isCollection,
    multiline,
    offset,
    wasRemoved
  } = renderContext
  if (wasRemoved) {
    renderRemovedItem(renderContext)
  } else {
    const showPath = isCollection && context.shouldShowPath(change.id)
    return (
      <tr className='sqwerl-table-row-link' key={index + offset} onClick={() => (location.href = linkTarget)}>
        <td className={`sqwerl-properties-table-index-column ${indexColumnWidth} ${multiline}`}>
          {intl.formatNumber(offset + index + 1)}
        </td>
        <ChangeLabel
          change={change}
          index={index}
          isLinkToCollection={isCollection}
          linkTarget={linkTarget}
          showPath={showPath}
        />
        <td className={`sqwerl-properties-table-secondary-column ${showPath ? 'multiline' : ''}`}>
          {renderThingType(context.typeIdToTypeName(change.typeId))}
        </td>
        <td className={`sqwerl-properties-table-secondary-column ${showPath ? 'multiline' : ''}`}>
          {renderTypeOfChange(intl, change.typeOfChange)}
        </td>
      </tr>
    )
  }
}

/**
 * Renders a table row that describes a thing that has been removed from a library of things.
 * @param renderContext Information required to describe changes made to a thing.
 */
const renderRemovedItem = (renderContext: RenderContext) => {
  const {
    change,
    context,
    index,
    intl,
    linkTarget,
    offset,
    indexColumnWidth,
    multiline,
    isCollection
  } = renderContext
  return (
    <tr key={index + offset}>
      <td className={`sqwerl-properties-table-index-column ${indexColumnWidth} ${multiline}`}>
        {intl.formatNumber(offset + index + 1)}
      </td>
      <ChangeLabel
        change={change}
        index={index}
        isLinkToCollection={isCollection}
        linkTarget={linkTarget}
        showPath={isCollection && context.shouldShowPath(change.id)}
      />
      <td className={`sqwerl-properties-table-secondary-column ${isCollection ? 'multiline' : ''}`}>
        {renderThingType(context.typeIdToTypeName(change.typeId))}
      </td>
      <td className={`sqwerl-properties-table-secondary-column ${isCollection ? 'multiline' : ''}`}>
        {renderTypeOfChange(intl, change.typeOfChange)}
      </td>
    </tr>
  )
}

/**
 * Renders the name for a type of thing.
 * @param typeName
 */
const renderThingType = (typeName: string) => {
  return (
    <div className='sqwerl-type-name-cell'>
      <span className='sqwerl-type-name'>{typeName}</span>
    </div>
  )
}

/**
 * Returns HTML content to display to indicate the type of change made to a thing.
 * @param intl Internationalization.
 * @param typeOfChangeId Uniquely identifies a type of change made to a thing.
 * @returns HTML content.
 */
const renderTypeOfChange = (intl: IntlShape, typeOfChangeId: string) => {
  const render = (text: string, icon: Function) => {
    return (
      <div className='sqwerl-type-of-change-name-cell'>
        <span className='sqwerl-type-of-change-text'>{text}</span>
        <span className='sqwerl-type-of-change-icon'>{icon()}</span>
      </div>
    )
  }
  switch (typeOfChangeId.toLowerCase()) {
    case 'added':
      return render(
        intl.formatMessage({ id: 'typeOfChange.added' }), () => <PlusSquare />)
    case 'modified':
      return render(intl.formatMessage({ id: 'typeOfChange.modified' }), () => <Edit3 />)
    case 'removed':
      return render(intl.formatMessage({ id: 'typeOfChange.deleted' }), () => <Trash2 />)
    default:
      return render(intl.formatMessage({ id: 'typeOfChange.unknown' }), () => <HelpCircle />)
  }
}

export default LibraryChanges
