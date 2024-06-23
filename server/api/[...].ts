import { joinURL } from 'ufo';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const runtimeConfig = useRuntimeConfig();
    const proxyUrl = runtimeConfig.BIApiBase;
    const proxyUrl = runtimeConfig.biApiBase;
    const target = joinURL(proxyUrl, event.path);
    return proxyRequest(event, target);
  }
});
