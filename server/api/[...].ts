import { joinURL } from 'ufo';

export default defineEventHandler({
  onRequest: [auth()],
  handler: async (event) => {
    const runtimeConfig = useRuntimeConfig();
    const proxyUrl = runtimeConfig.biApiBase;
    const target = joinURL(proxyUrl, event.path);
    const headers = runtimeConfig.biApiKey ? {
      "X-Api-Key": runtimeConfig.biApiKey,
    } : {}
    return proxyRequest(event, target, {
      headers: headers
    });
  }
});
