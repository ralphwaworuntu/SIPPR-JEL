import { mysqlTable, serial, varchar, date, text, timestamp, boolean, json, int } from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
    id: varchar("id", { length: 36 }).primaryKey(),
    name: text("name").notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: boolean("emailVerified").notNull(),
    image: text("image"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull()
});

export const session = mysqlTable("session", {
    id: varchar("id", { length: 36 }).primaryKey(),
    expiresAt: timestamp("expiresAt").notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
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
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull()
});

export const verification = mysqlTable("verification", {
    id: varchar("id", { length: 36 }).primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt"),
    updatedAt: timestamp("updatedAt")
});

export const congregants = mysqlTable("congregants", {
    id: serial("id").primaryKey(),
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
    major: varchar("major", { length: 100 }),
    jobCategory: varchar("job_category", { length: 100 }),
    jobTitle: varchar("job_title", { length: 100 }),
    companyName: varchar("company_name", { length: 150 }),
    yearsOfExperience: int("years_of_experience").default(0),

    // Skills
    skills: json("skills"), // string[]

    // Commitment
    willingnessToServe: varchar("willingness_to_serve", { length: 50 }), // Aktif, On-demand, Not-available
    interestAreas: json("interest_areas"), // string[]
    contributionTypes: json("contribution_types"), // string[]

    // Geolocation
    latitude: varchar("latitude", { length: 50 }),
    longitude: varchar("longitude", { length: 50 }),

    status: varchar("status", { length: 20 }).default('PENDING'), // PENDING, VALIDATED

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const notifications = mysqlTable("notifications", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    message: text("message").notNull(),
    type: varchar("type", { length: 20 }).default('info'), // info, warning, success
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("created_at").defaultNow()
});
