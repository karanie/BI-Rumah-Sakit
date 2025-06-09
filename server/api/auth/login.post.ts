import pgclient from "@/utils/db.server";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const res = await pgclient.query(
    `SELECT * FROM "user" WHERE username = $1`, [ body.username ]
  );
  if (!res.rows[0]) {
    throw createError({
      statusCode: 401,
      statusMessage: "Wrong password or username",
    });
  }

  const passwordIsCorrect = bcrypt.compareSync(body.password, res.rows[0].password);
  if (!passwordIsCorrect) {
    throw createError({
      statusCode: 401,
      statusMessage: "Wrong password or username",
    });
  }

  const session = await setUserSession(event, {
    user: {
      user_id: res.rows[0].user_id,
      username: res.rows[0].username,
      nama_lengkap: res.rows[0].nama_lengkap,
      jabatan: res.rows[0].jabatan,
      role: res.rows[0].role,
    },
  });

  return {
    message: "Success",
  };
});
