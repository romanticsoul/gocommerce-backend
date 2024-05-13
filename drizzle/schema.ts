import { pgTable, foreignKey, pgEnum, uuid, text, timestamp, bigint, smallint, boolean, unique } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const keyStatus = pgEnum("key_status", ['default', 'valid', 'invalid', 'expired'])
export const keyType = pgEnum("key_type", ['aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20'])
export const factorType = pgEnum("factor_type", ['totp', 'webauthn'])
export const factorStatus = pgEnum("factor_status", ['unverified', 'verified'])
export const aalLevel = pgEnum("aal_level", ['aal1', 'aal2', 'aal3'])
export const codeChallengeMethod = pgEnum("code_challenge_method", ['s256', 'plain'])
export const equalityOp = pgEnum("equality_op", ['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in'])
export const action = pgEnum("action", ['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR'])


export const parameterValues = pgTable("parameter_values", {
	valueId: uuid("value_id").defaultRandom().primaryKey().notNull(),
	value: text("value").notNull(),
	description: text("description"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	parameterId: uuid("parameter_id").notNull().references(() => parameters.parameterId, { onDelete: "cascade", onUpdate: "cascade" } ),
	productId: uuid("product_id").notNull().references(() => products.productId, { onDelete: "cascade", onUpdate: "cascade" } ),
});

export const products = pgTable("products", {
	productId: uuid("product_id").defaultRandom().primaryKey().notNull(),
	name: text("name").notNull(),
	description: text("description"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	price: bigint("price", { mode: "number" }).notNull(),
	taxRate: smallint("tax_rate").notNull(),
	discountPercentage: smallint("discount_percentage").notNull(),
	isDisabled: boolean("is_disabled").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	productGroupId: uuid("product_group_id").defaultRandom().notNull().references(() => productGroups.productGroupId),
});

export const projects = pgTable("projects", {
	projectId: uuid("project_id").defaultRandom().primaryKey().notNull(),
	name: text("name").notNull(),
	uniqueName: text("unique_name").notNull(),
	description: text("description"),
	logoUrl: text("logo_url"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		projectsUniqueNameKey: unique("projects_unique_name_key").on(table.uniqueName),
	}
});

export const categories = pgTable("categories", {
	categoryId: uuid("category_id").defaultRandom().primaryKey().notNull(),
	name: text("name").notNull(),
	description: text("description"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	parentCategoryId: uuid("parent_category_id").defaultRandom(),
	projectId: uuid("project_id").defaultRandom().notNull().references(() => projects.projectId, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => {
	return {
		publicCategoriesParentCategoryIdFkey: foreignKey({
			columns: [table.parentCategoryId],
			foreignColumns: [table.categoryId],
			name: "public_categories_parent_category_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	}
});

export const productGroups = pgTable("product_groups", {
	productGroupId: uuid("product_group_id").defaultRandom().primaryKey().notNull(),
	categoryId: uuid("category_id").notNull().references(() => categories.categoryId, { onDelete: "cascade", onUpdate: "cascade" } ),
});

export const predefinedParameterValues = pgTable("predefined_parameter_values", {
	predefinedValueId: uuid("predefined_value_id").defaultRandom().primaryKey().notNull(),
	value: text("value").notNull(),
	description: text("description"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	parameterId: uuid("parameter_id").notNull().references(() => parameters.parameterId, { onDelete: "cascade", onUpdate: "cascade" } ),
});

export const parameters = pgTable("parameters", {
	parameterId: uuid("parameter_id").defaultRandom().primaryKey().notNull(),
	name: text("name").notNull(),
	description: text("description"),
	isInherited: boolean("is_inherited").default(true).notNull(),
	isTechnical: boolean("is_technical").default(false).notNull(),
	onlyOneValue: boolean("only_one_value").default(false).notNull(),
	onlyPreparedValues: boolean("only_prepared_values").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	categoryId: uuid("category_id").defaultRandom().notNull().references(() => categories.categoryId, { onDelete: "cascade", onUpdate: "cascade" } ),
});