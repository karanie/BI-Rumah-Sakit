import pgclient from "@/utils/db.server";

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    try {
      const res = await pgclient.query(
        `DELETE FROM "user" WHERE user_id = $1`, [
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
