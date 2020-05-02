import { app } from "../index";

app.command("/echo", async ({ command, ack, say }) => {
  // コマンドリクエストを確認
  await ack();

  await say(`${command.text}`);
});
