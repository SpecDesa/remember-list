// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  serial,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { ListStatus } from "./types";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `remember-list_${name}`);


export const lists = createTable(
  "lists",
  {
    id: serial("id").primaryKey().notNull(),
//     userId: varchar("user_id", {length: 1024}).notNull(),
    name: varchar("name", {length: 1024}),
    // parentId: integer("parent_id").references((): AnyPgColumn => lists.id),
    type: varchar("type", {length: 256 }).default(ListStatus.STOCKING).notNull(),
  }
)

export const listsRelationships = createTable(
  "lists_relationships",
  {
    id: serial("id").primaryKey().notNull(),
    parentListId: integer("parent_list_id").references(() => lists.id).notNull(),
    childListId: integer("child_list_id").references(() => lists.id).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (example) => ({
    parentListIdIndex: index("lists_relationships_parent_list_id_idx").on(
      example.parentListId
    ),
    childListIdIndex: index("lists_relationships_child_list_id_idx").on(
      example.childListId
    ),
  })
);

export const items = createTable(
  "items",
  {
    id: serial("id").primaryKey().notNull(),
    name: varchar("name", { length: 256 }),
    listsId: integer("lists_id").references(() => lists.id).notNull(),
    quantity: integer("quantity").default(0).notNull(),
    threshold: integer("threshold"), // Minimum quantity to maintain
    timeThreshold: varchar("time_threshold", { length: 256 }), // Interval to buy the item (e.g., '1 week', '1 month')
    lastPurchased: timestamp("last_purchased", { withTimezone: true }), // Last time the item was purchased
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }),
  },
  (example) => ({
    nameIndex: index("items_name_idx").on(example.name),
  })
);

// Users table to manage individual users
export const users = createTable(
  "users",
  {
    id: serial("id").primaryKey().notNull(),
    username: varchar("username", { length: 256 }).notNull().unique(),
    clerkId: varchar("clerk_id", {length: 256}).notNull().unique(),
    email: varchar("email", { length: 256 }).notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (example) => ({
    usernameIndex: index("users_username_idx").on(example.username),
    emailIndex: index("users_email_idx").on(example.email),
  })
);


// UserItems table to manage items shared with users
export const listsUsers = createTable(
  "lists_users",
  {
    id: serial("id").primaryKey().notNull(),
    usersId: integer("users_id").references(() => users.id).notNull(),
    listsId: integer("lists_id").references(() => lists.id).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (example) => ({
    userIdIndex: index("lists_users_user_id_idx").on(example.usersId),
    listIdIndex: index("lists_users_list_id_idx").on(example.listsId),
    uniqueUserItem: unique("lists_users_unique_user_list").on(example.usersId, example.listsId),
  })
);
