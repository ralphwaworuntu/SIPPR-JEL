import { mysqlTable, serial, varchar, date, text, timestamp, boolean, json, int, datetime } from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
    id: varchar("id", { length: 36 }).primaryKey(),
    name: text("name").notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: boolean("emailVerified").notNull(),
    image: text("image"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow()
});

export const session = mysqlTable("session", {
    id: varchar("id", { length: 36 }).primaryKey(),
    expiresAt: timestamp("expiresAt").notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: varchar("userId", { length: 36 }).notNull().references(() => user.id)
});

export const account = mysqlTable("account", {
    id: varchar("id", { length: 36 }).primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: varchar("userId", { length: 36 }).notNull().references(() => user.id),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: datetime("accessTokenExpiresAt"),
    refreshTokenExpiresAt: datetime("refreshTokenExpiresAt"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow()
});

export const verification = mysqlTable("verification", {
    id: varchar("id", { length: 36 }).primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow()
});

export const congregants = mysqlTable("congregants", {
    id: int("id").primaryKey().autoincrement(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    gender: varchar("gender", { length: 20 }), // Laki-laki / Perempuan
    dateOfBirth: date("date_of_birth"),
    phone: varchar("phone", { length: 20 }),

    // Church Details
    sector: varchar("sector", { length: 50 }),
    lingkungan: varchar("lingkungan", { length: 50 }),
    rayon: varchar("rayon", { length: 50 }),

    address: text("address"),

    // Professional
    educationLevel: varchar("education_level", { length: 50 }),
    jobCategory: varchar("job_category", { length: 100 }),

    // Skills (Storing as simple JSON or string for now to match form)
    skills: json("skills"), // string[]

    willingnessToServe: boolean("willingness_to_serve").default(false),

    status: varchar("status", { length: 20 }).default('PENDING'), // PENDING, VALIDATED

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});
