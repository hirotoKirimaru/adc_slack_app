import { app } from "../initializers/bolt";

app.message("hello", async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say(`Hey there <@${message.user}>!`);
});
