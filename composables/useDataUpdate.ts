export const useDataUpdate = defineStore('dataUpdate', () => {
  if (!import.meta.client) {
    return {
      update: 0,
      close: () => {},
    };
  }

  const update = ref()
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  const ws = new WebSocket(`${protocol}//${host}/_ws/`);
  ws.onmessage = e => {
    console.log(e.data);
    update.value = Date.now()
  }
  ws.onerror = e => console.log(e)

  function close() {
    ws.close()
  }

  return {
    update,
    close
  }
});
