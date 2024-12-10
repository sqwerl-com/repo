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

export interface ControlsShape {
  controls: CollectionType<Thing>
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

export interface HasListenedToShape {
  hasListenedTo: CollectionType<Thing>
}

export interface HasListenersShape {
  listeners: CollectionType<Thing>
}

export interface HasPictureData {
  pictureData?: PictureData[]
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

export interface HasTeamsShape {
  teams: CollectionType<Thing>
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

export interface PostsShape {
  posts: CollectionType<Thing>
  postsCount: number
}

export interface SpokeAtShape {
  spokeAt: CollectionType<Thing>
}

export interface SubscribersShape {
  subscribers: CollectionType<Thing>
}

export interface SubscriptionsShape {
  subscriptions: CollectionType<Thing>
}

export interface TeamShape {
  parent: Thing
  contributors: CollectionType<Thing>
  roles: CollectionType<Thing>
  subteams: CollectionType<Thing>
}

export interface ThumbnailShape {
  href: string
  name?: string
}

export interface TaggedShape {
  taggedCount: number
}

/**
 * Basic type for anything stored in a Sqwerl repository.
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
  links: CollectionType<Thing>
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
  links: CollectionType<Thing>,
  name: string,
  pictureOf: CollectionType<Thing>,
  representations: CollectionType<Thing>,
  shortDescription: string,
  tags: CollectionType<Thing>
}

export interface PictureData {
  href: string,
  name: string
}

/**
 * Describes a change someone made to a thing within a Sqwerl repository of things.
 */
export interface RepositoryChangeDescription extends HasPictureData {
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
 * Describes a commit of changes made to a repository of things.
 */
export interface RepositoryChangeType {
  by: string
  date: string
  id?: string
  members: RepositoryChangeDescription[]
  totalCount: number
}

export interface RepositoryChanges {
  changes: RepositoryChangeType[]
  commits: string[]
  href: string
  id: string
  path: string
  type: string
}

export interface RepositoryChangesShape {
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

export interface RepositoryShape {
  recentChanges: RepositoryChangesShape[]
  thingCount: number
}

/* TODO - This is not being used right now, but will be used when we implement security roles.
export interface RoleShape {
  capabilities: CollectionType<Thing>
  teams: CollectionType<Thing>
}
*/

export interface TypeIdShape {
  typeId: string
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
  CollectionType<Thing> &
  ControlsShape &
  Course &
  HasAttendedShape &
  HasCapabilitiesShape &
  HasEpisodesShape &
  HasFeedsShape &
  HasFeedUrlShape &
  HasListenedToShape &
  HasListenersShape &
  HasPictureData &
  HasPictureOfShape &
  HasReadShape &
  HasSpeakersShape &
  HasTagShape &
  HasTeamsShape &
  HasThumbnailUrlShape &
  HasUrlShape &
  HasViewedShape &
  HasWebPageShape &
  InstructedShape &
  IsAttendingShape &
  IsReadingShape &
  LinksShape &
  MiddleNameOrInitialShape &
  NotesShape &
  PostsShape &
  RepositoryChanges &
  RepositoryChangesShape &
  RepositoryShape &
  SpokeAtShape &
  SubscribersShape &
  SubscriptionsShape &
  TaggedShape &
  TeamShape &
  TypeIdShape &
  TypeShape &
  ViewedByShape
