CREATE TABLE "characters" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"alignment" varchar(256) NOT NULL,
	"intelligence" integer NOT NULL,
	"strength" integer NOT NULL,
	"speed" integer NOT NULL,
	"durability" integer NOT NULL,
	"power" integer NOT NULL,
	"combat" integer NOT NULL,
	"total" integer NOT NULL
);
