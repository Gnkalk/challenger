import { relations } from 'drizzle-orm';
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
  unique,
} from 'drizzle-orm/sqlite-core';

export const challengesTable = sqliteTable('challenge', {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text().notNull(),
  description: text().notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  createdBy: text('created_by')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  plan: text().notNull(),
  status: text({ enum: ['open', 'closed'] }).notNull(),
  day: integer('day').notNull().default(0),
});

export const challengeDayTable = sqliteTable(
  'challenge_day',
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    challengeId: text()
      .notNull()
      .references(() => challengesTable.id, { onDelete: 'cascade' }),
    day: integer().notNull(),
    date: integer('date', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    challengeIDByDay: unique('challenge_id_day').on(
      table.challengeId,
      table.day
    ),
  })
);

import type { AdapterAccountType } from 'next-auth/adapters';

export const usersTable = sqliteTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  locale: text('locale', { enum: ['en', 'fa'] }).default('en'),
  image: text('image'),
});

export const accountsTable = sqliteTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessionsTable = sqliteTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
});

export const authenticatorsTable = sqliteTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: integer('credentialBackedUp', {
      mode: 'boolean',
    }).notNull(),
    transports: text('transports'),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export const userChallengesRelations = relations(
  challengesTable,
  ({ one, many }) => ({
    challengeCreatedBy: one(usersTable, {
      fields: [challengesTable.createdBy],
      references: [usersTable.id],
    }),
    challengeDays: many(challengeDayTable),
    challengeParticipants: many(challengeParticipants),
  })
);

export const challengeDaysRelations = relations(
  challengeDayTable,
  ({ one, many }) => ({
    challengeDaysChallenge: one(challengesTable, {
      fields: [challengeDayTable.challengeId],
      references: [challengesTable.id],
    }),
    participants: many(challengeDayParticipants),
  })
);

export const challengeParticipants = sqliteTable(
  'challenge_participant',
  {
    challengeId: text()
      .notNull()
      .references(() => challengesTable.id, { onDelete: 'cascade' }),
    userId: text()
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    id: primaryKey({ name: 'id', columns: [table.challengeId, table.userId] }),
  })
);

export const challengeParticipantsRelations = relations(
  challengeParticipants,
  ({ one }) => ({
    challenge: one(challengesTable, {
      fields: [challengeParticipants.challengeId],
      references: [challengesTable.id],
    }),
    participant: one(usersTable, {
      fields: [challengeParticipants.userId],
      references: [usersTable.id],
    }),
  })
);

export const challengeDayParticipants = sqliteTable(
  'challenge_day_participant',
  {
    doneAt: integer('done_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    challengeDayId: text()
      .notNull()
      .references(() => challengeDayTable.id, { onDelete: 'cascade' }),
    userId: text()
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    id: primaryKey({
      name: 'id',
      columns: [table.challengeDayId, table.userId],
    }),
  })
);

export const challengeDayParticipantsRelations = relations(
  challengeDayParticipants,
  ({ one }) => ({
    challengeDay: one(challengeDayTable, {
      fields: [challengeDayParticipants.challengeDayId],
      references: [challengeDayTable.id],
    }),
    participant: one(usersTable, {
      fields: [challengeDayParticipants.userId],
      references: [usersTable.id],
    }),
  })
);

export const userRelations = relations(usersTable, ({ many }) => ({
  challenges: many(challengeParticipants),
  challengeDays: many(challengeDayParticipants),
}));
