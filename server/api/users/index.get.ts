import pgclient from "@/utils/db.server";

export default defineEventHandler({
  onRequest: [auth("admin")],
  handler: async (event) => {
    const res = await pgclient.query(
      `SELECT
        user_id,
        username,
        nama_lengkap,
        role,
        no_hp,
        ctime
       FROM "user"`,
    );

    return { rows: res.rows, rowCount: res.rowCount };
  }
});
