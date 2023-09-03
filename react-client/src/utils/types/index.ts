export interface CollectionType<T> {
  members: T[]
  offset: number
  totalCount: number
}

export interface Archived {
  archived: boolean
}

export interface AttendedBy {
  attendedBy: CollectionType<Thing>
  attending: CollectionType<Thing>
}

export interface AttendedByShape {
  hasAttendedCount: number
  firstName: string
  id: string
  lastName: string
  name: string
  type: string
}

export interface AttendingShape {
  attendingCount: number
}

export interface AuthorOfShape {
  authorOf: CollectionType<Thing>
  authorOfCount: number
}

export interface CollectionShape {
  children: CollectionType<Thing>
  childrenCount: number
}

export interface GroupShape {
  parent: Thing
  roles: CollectionType<Thing>
  subgroups: CollectionType<Thing>
  users: CollectionType<Thing>
}

export interface HasAttendedShape {
  hasAttended: CollectionType<Thing>
}

export interface HasCapabilitiesShape {
  capabilities: CollectionType<Thing>
}

export interface HasEpisodesShape {
  episodes: CollectionType<Thing>
}

export interface HasFeedsShape {
  feeds: CollectionType<Thing>
}

export interface HasFeedUrlShape {
  feedUrl: string
}

export interface HasGroupsShape {
  groups: CollectionType<Thing>
}

export interface HasListenedToShape {
  hasListenedTo: CollectionType<Thing>
}

export interface HasListenersShape {
  listeners: CollectionType<Thing>
}

export interface HasPictureOfShape {
  pictureOf: CollectionType<Thing>
}

export interface HasReadShape {
  hasRead: CollectionType<Thing>
  hasReadCount: number
}

export interface HasSpeakersShape {
  speakers: CollectionType<Thing>
}

export interface HasTagShape {
  tagged: CollectionType<Thing>
}

export interface HasThumbnailUrlShape {
  thumbnailUrl: string
}

export interface HasUrlShape {
  url: string
}

export interface HasViewedShape {
  hasViewed: CollectionType<Thing>
  hasViewedCount: number
}

export interface HasWebPageShape {
  webPage: Thing
}

export interface InstructedShape {
  instructedCount: number
  instructed: CollectionType<Thing>
}

export interface IsAttendingShape {
  isAttending: CollectionType<Thing>
}

export interface IsReadingShape {
  isReading: CollectionType<Thing>
  isReadingCount: number
}

export type LinksShape = BasicThing & { linksCount: number }

export interface NotesShape {
  done: boolean
  name: string
  notesFor: CollectionType<Thing>
}

export interface OwnsShape {
  owns: CollectionType<Thing>
}

export interface SpokeAtShape {
  spokeAt: CollectionType<Thing>
}

export interface ThumbnailShape {
  href: string
  name?: string
}

export interface TaggedShape {
  taggedCount: number
}

/**
 * Basic type for anything stored in a Sqwerl library.
 */
export interface BasicThing {
  addedBy: Thing
  addedOn: string
  archived: boolean
  href: string | null
  id: string
  isType: boolean
  name: string
  path: string
  thumbnails?: ThumbnailShape[]
  type: string
  typeName: string
  typeNameIsPlural: boolean
}

export interface Book {
  addedBy: Thing
  addedOn: string
  archived: boolean
  authors: CollectionType<Thing>
  collections: CollectionType<Thing>
  links: CollectionType<LinksShape>
  name: string
  notes: CollectionType<Thing>
  pictures: CollectionType<Thing>
  readBy: CollectionType<Thing>
  readers: CollectionType<Thing>
  recommendedBy: CollectionType<Thing>
  recommendations: CollectionType<Thing>
  representations: CollectionType<Thing>
  tags: CollectionType<Thing>
  thumbnailUrl: string
  title: string
  webPages: CollectionType<Thing>
}

export interface Course {
  instructors: CollectionType<Thing>
}

/**
 * Describes a change someone made to a thing within a Sqwerl library of things.
 */
export interface LibraryChangeDescription {
  date: string
  href: string
  id: string
  isCollection: boolean
  name: string
  path: string
  typeId: string
  typeOfChange: string
}

/**
 * Describes a commit of changes made to a library of things.
 */
export interface LibraryChangeType {
  by: string
  date: string
  id?: string
  members: LibraryChangeDescription[]
  totalCount: number
}

/**
 * A collection of descriptions of changes made to things within a library of things.
 */
export interface LibraryChanges {
  changes: LibraryChangeType[]
  commits: string[]
  href: string
  id: string
  path: string
  type: string
}

export interface LibraryChangesShape {
  by: string
  changesCount: number
  date: string
  hasMoreThanOne: boolean
  id: string
  ids: string[]
  idsAsList: string
  isCollapsed: boolean
  index: number
  who: string[]
}

export interface LibraryShape {
  recentChanges: LibraryChangesShape[]
  thingCount: number
}

export interface MiddleNameOrInitialShape {
  middleNameOrInitial: string
}

export interface Picture {
  addedBy: Thing,
  addedOn: string,
  archived: boolean,
  authors: CollectionType<Thing>,
  collections: CollectionType<Thing>,
  description: string,
  links: CollectionType<LinksShape>,
  name: string,
  pictureOf: CollectionType<Thing>,
  representations: CollectionType<Thing>,
  shortDescription: string,
  tags: CollectionType<Thing>
}

export interface RoleShape {
  capabilities: CollectionType<Thing>
  groups: CollectionType<Thing>
}

export interface TypeShape {
  children: CollectionType<Thing>
  description: string
  name: string
  shortDescription: string
}

export interface ViewedByShape {
  viewedBy: CollectionType<Thing>
}

export type Thing =
  Archived &
  AttendedBy &
  AttendedByShape &
  AttendingShape &
  AuthorOfShape &
  BasicThing &
  Book &
  CollectionShape &
  CollectionType<any> &
  Course &
  GroupShape &
  HasAttendedShape &
  HasCapabilitiesShape &
  HasEpisodesShape &
  HasFeedsShape &
  HasFeedUrlShape &
  HasGroupsShape &
  HasListenedToShape &
  HasListenersShape &
  HasPictureOfShape &
  HasReadShape &
  HasSpeakersShape &
  HasTagShape &
  HasThumbnailUrlShape &
  HasUrlShape &
  HasViewedShape &
  HasWebPageShape &
  InstructedShape &
  IsAttendingShape &
  IsReadingShape &
  LibraryChanges &
  LibraryChangesShape &
  LibraryShape &
  LinksShape &
  MiddleNameOrInitialShape &
  NotesShape &
  OwnsShape &
  SpokeAtShape &
  TaggedShape &
  TypeShape &
  ViewedByShape
