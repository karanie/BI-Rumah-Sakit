import pgclient from "@/utils/db.server";

export default defineEventHandler({
  onRequest: [auth("admin")],
  handler: async (event) => {
    const body = await readBody(event);

    try {
      const res = await pgclient.query(
        `UPDATE "user" SET
          nama_lengkap = $1,
          role = $2,
          no_hp = $3
        WHERE user_id = $4`, [
          body.nama_lengkap,
          body.role,
          body.no_hp,
          getRouterParam(event, 'id')
        ]
      );
      return "Success";
    } catch (err) {
      throw createError({
        statusCode: 500,
        statusMessage: "Something went wrong",
      });
    }
  }
});
