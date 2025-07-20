import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

export const challengesTable = sqliteTable('challenge', {
  id: text()
    .primaryKey()
    .$defaultFn(() => 'lower(hex(randomblob(16))) '),
  name: text().notNull(),
  description: text().notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  createdBy: text('created_by').notNull(),
  plan: text().notNull(),
  status: text({ enum: ['open', 'closed'] }).notNull(),
  activeDays: text('active_days', { mode: 'json' }).notNull(),
  participants: text('joined_people', { mode: 'json' }).notNull(),
});

export const challengeDayTable = sqliteTable(
  'challenge_day',
  {
    challengeId: text()
      .notNull()
      .references(() => challengesTable.id),
    day: integer().notNull(),
    participants: text('joined_people', { mode: 'json' }).notNull(),
  },
  (table) => [
    primaryKey({ name: 'id', columns: [table.challengeId, table.day] }),
  ]
);
