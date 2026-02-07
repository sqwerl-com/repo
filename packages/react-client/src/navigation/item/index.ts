import { CollectionType, HasPictureData, Thing } from '@/utilities/types'

/**
 * Implemented by items within a navigation list where the items represent things within a repository.
 */
export interface Item extends HasPictureData {
  /** The index (zero-based) of the item within its collection of its parent's children. */
  childIndex: number

  /** A thing's child things. */
  children: CollectionType<Thing>

  /** The number of children a thing has. */
  childrenCount: number

  /** Text that describes a thing. */
  description: string

  /** A thing's unique identifier. */
  id: string

  /** Are we loading information about a thing? */
  isLoading: boolean

  /** A thing's name. */
  name: string

  /** The thing's unique to its location within a repository. */
  path: string

  /** A brief textual description of a thing. */
  shortDescription: string

  /** The offset (zero-based) of the location of a thing within the collection the user is currently navigating. */
  startOffset: number,

  /** Unique identifier for a thing's type. */
  type: string

  /** The name of a thing's type. */
  typeName?: string
}
