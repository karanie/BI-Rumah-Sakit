export const useDataUpdate = defineStore('dataUpdate', () => {
  const update = ref()

  const ws = new WebSocket("/_ws");
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
