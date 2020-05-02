import { App } from "@slack/bolt";

export const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();

// 動的にboltに対してrequiredしに行くロジック。
const fs = require("fs");
const contextRoot = "./src"; // srcのrootPath
const paths: string[] = ["commands", "message"]; // appに対してimportする対象ディレクトリ

paths.forEach((path) => {
  fs.readdir(contextRoot + "/" + path, function (err: any, files: string[]) {
    if (err) throw err;
    files.forEach((file) => {
      require("./" + path + "/" + file);
    });
  });
});
