import pgclient from "@/utils/db.server";

export default defineEventHandler(async (event) => {
  try {
    const res = await pgclient.query(
      `SELECT
      user_id,
      username,
      nama_lengkap,
      role,
      no_hp,
      ctime
      FROM "user" WHERE user_id = $1`, [
        getRouterParam(event, 'id')
      ]
    );
    return res.rows[0];
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: "Something went wrong",
    });
  }
});
