import pg from "pg";

const config = useRuntimeConfig();

const pgclient = new pg.Client({
  user: "postgres",
  host: config.BIDatabaseAddr,
  database: "birumahsakit",
  password: "password",
});
pgclient.connect();

export default pgclient;
