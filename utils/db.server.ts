import pg from "pg";

const config = useRuntimeConfig();

const pgclient = new pg.Client({
  user: config.biDatabaseUser,
  host: config.biDatabaseAddr,
  database: config.biDatabaseName,
  password: config.biDatabasePassword,
  port: config.biDatabasePort
});
pgclient.connect();

export default pgclient;
