import { joinURL } from 'ufo';

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const proxyUrl = runtimeConfig.biApiBase;
  const target = joinURL(proxyUrl, event.path);
  return proxyRequest(event, target);
});
