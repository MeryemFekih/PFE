export const PostType = {
  GENERAL: 'GENERAL',
  EVENT: 'EVENT',
  FORMATION: 'FORMATION',
  COURSE_MATERIAL: 'COURSE_MATERIAL',
  REVISION_EXERCISE: 'REVISION_EXERCISE',
  
} as const;

export type PostType = (typeof PostType)[keyof typeof PostType];

export const EventType = {
  CONFERENCE: 'CONFERENCE',
  WORKSHOP: 'WORKSHOP',
  HACKATHON_ALERT: 'HACKATHON_ALERT',
} as const;

export type EventType = (typeof EventType)[keyof typeof EventType];

export const Visibility = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
} as const;

export type Visibility = (typeof Visibility)[keyof typeof Visibility];
