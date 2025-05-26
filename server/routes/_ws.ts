import createPostgresSubscriber from "pg-listen";
import type { Subscriber } from "pg-listen";

let subscriber: Subscriber | null = null;
let peerCount = 0;

export default defineWebSocketHandler({
  open(peer) {
    peer.subscribe("new_data_notification");
    if (peerCount == 0) {
      const runtimeConfig = useRuntimeConfig();
      const conStr = `postgres://${runtimeConfig.biDatabaseUser}:${runtimeConfig.biDatabasePassword}@${runtimeConfig.biDatabaseAddr}/${runtimeConfig.biDatabaseName}`

      console.log(`Listening to new_data_channel`);
      subscriber = createPostgresSubscriber({ connectionString: conStr }, { serialize: String, parse: String });

      subscriber.notifications.on("new_data_channel", payload => {
        console.log(`Received from PG notifications`)
        peer.publish("new_data_notification", payload)
        peer.send(payload)
      });
      subscriber.events.on("error", (error) => {
        console.error("Fatal database connection error:", error)
      });

      subscriber.connect();
      subscriber.listenTo("new_data_channel");
    }
    peerCount++;
  },

  close(peer, event) {
    if (subscriber && peerCount == 1)
      subscriber.close()
    peer.unsubscribe("new_data_notification");
    peerCount--;
  },

  error(peer, error) {
    console.log("[ws] error", peer, error);
  },
});
