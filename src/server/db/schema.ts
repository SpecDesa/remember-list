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

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `remember-list_${name}`);

export const images = createTable (
  "image",
  {
    id: serial("id").primaryKey().notNull(),
    name: varchar("name", {length: 1024}),
    url: varchar("url", {length: 1024})
  },
  (example) => ({
    nameIndex: index("image_name_idx").on(example.name),
    // categoryIdIndex: index("category_id_idx").on(example.categoryId),
  })
)

export const lists = createTable(
  "list",
  {
    id: serial("id").primaryKey().notNull(),
    userId: varchar("user_id", {length: 1024}).notNull(),
    name: varchar("name", {length: 1024}),
  }
)

export const items = createTable(
  "item",
  {
    id: serial("id").primaryKey().notNull(),
    name: varchar("name", { length: 256 }),
    categoryId: integer("category_id").references(() => categories.id),
    quantity: integer("quantity").default(0).notNull(),
    threshold: integer("threshold").default(0).notNull(), // Minimum quantity to maintain
    timeThreshold: varchar("time_threshold", { length: 256 }), // Interval to buy the item (e.g., '1 week', '1 month')
    lastPurchased: timestamp("last_purchased", { withTimezone: true }), // Last time the item was purchased
    status: varchar("status", { length: 50 }).default('needed').notNull(), // Status could be 'needed' or 'at home'
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }),
  },
  (example) => ({
    nameIndex: index("item_name_idx").on(example.name),
    // categoryIdIndex: index("category_id_idx").on(example.categoryId),
  })
);

// Users table to manage individual users
export const users = createTable(
  "user",
  {
    id: serial("id").primaryKey().notNull(),
    username: varchar("username", { length: 256 }).notNull().unique(),
    email: varchar("email", { length: 256 }).notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (example) => ({
    usernameIndex: index("user_username_idx").on(example.username),
    emailIndex: index("user_email_idx").on(example.email),
  })
);

// Categories table to organize items
export const categories = createTable(
  "category",
  {
    id: serial("id").primaryKey().notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (example) => ({
    nameIndex: index("category_name_idx").on(example.name),
  })
);

// UserItems table to manage items shared with users
export const userItems = createTable(
  "user_item",
  {
    id: serial("id").primaryKey().notNull(),
    userId: integer("user_id").references(() => users.id).notNull(),
    itemId: integer("item_id").references(() => items.id).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (example) => ({
    userIdIndex: index("user_item_user_id_idx").on(example.userId),
    itemIdIndex: index("user_item_item_id_idx").on(example.itemId),
    uniqueUserItem: unique("user_item_unique_user_item").on(example.userId, example.itemId),
  })
);

// UserItems table to manage items shared with users
export const userLists = createTable(
  "user_list",
  {
    id: serial("id").primaryKey().notNull(),
    userId: integer("user_id").references(() => users.id).notNull(),
    listId: integer("list_id").references(() => lists.id).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (example) => ({
    userIdIndex: index("user_list_user_id_idx").on(example.userId),
    listIdIndex: index("user_list_list_id_idx").on(example.listId),
    uniqueUserItem: unique("user_list_unique_user_list").on(example.userId, example.listId),
  })
);