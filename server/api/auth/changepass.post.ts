import pgclient from "@/utils/db.server";
import bcrypt from "bcrypt";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const userRes = await pgclient.query(
    `SELECT * FROM "user" WHERE username = $1`, [ body.username ]
  );
  if (!userRes.rows[0]) {
    throw createError({
      statusCode: 401,
      statusMessage: "Wrong password or username",
    });
  }

  const passwordIsCorrect = bcrypt.compareSync(body.oldPassword, userRes.rows[0].password);
  if (!passwordIsCorrect) {
    throw createError({
      statusCode: 401,
      statusMessage: "Wrong password or username",
    });
  }

  const password = bcrypt.hashSync(body.newPassword, config.saltRounds);
  try {
    await pgclient.query(
      `
      UPDATE "user" SET password = $1 WHERE username = $2
      `,
      [
        password,
        body.username,
      ]
    );
    await clearUserSession(event);
    return "Success";
  } catch (err) {
    console.log(err);
    throw createError({
      statusCode: 500,
      statusMessage: "Something went wrong",
    });
  }
});
