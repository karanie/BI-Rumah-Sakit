export default function(role?: string) {
  return defineEventHandler(async (event) => {
    const session = await getUserSession(event)

    if (!session.user) {
      throw createError({
        statusCode: 403,
        statusMessage: "Unauthorized",
      });
    }

    if (role && session.user?.role != role) {
      throw createError({
        statusCode: 403,
        statusMessage: "Unauthorized",
      });
    }
  });
}
