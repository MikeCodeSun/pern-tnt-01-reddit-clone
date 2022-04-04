require("dotenv").config();

module.exports = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
  database: "reddit_test",
  synchronize: true,
  logging: true,
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
};
