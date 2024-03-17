import jwt from "jsonwebtoken";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const authHeader = getRequestHeader(event, "authorization");
  if (!authHeader) {
    throw createError({
      statusCode: 403,
      statusMessage: "Unauthorized",
    });
  }

  const [, token] = authHeader.split("Bearer ");
  try {
    return jwt.verify(token, config.tokenSecret)
  } catch(err) {
    throw createError({
      statusCode: 403,
      statusMessage: "Unauthorized",
    });
  }
});
