import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

export const trials = pgTable("trials", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().unique(),
  transcriptsUsed: integer("transcripts_used").default(0).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});
