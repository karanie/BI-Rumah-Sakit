import jwt from "jsonwebtoken";

const config = useRuntimeConfig();

export default defineEventHandler((event) => {
  const ipAddr = getRequestIP(event);
  const url = getRequestURL(event);
  console.log(`Auth checking from ${ipAddr} on ${url}`);

  const cookiepookiedookie = parseCookies(event)
  if (!cookiepookiedookie['auth.token']) {
    throw createError({
      statusCode: 403,
      statusMessage: "Unauthorized",
    });
  }

  const token = cookiepookiedookie['auth.token'];
  try {
    jwt.verify(token, config.tokenSecret)
  } catch(err) {
    throw createError({
      statusCode: 403,
      statusMessage: "Unauthorized",
    });
  }
});
