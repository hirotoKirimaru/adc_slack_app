import { app } from "../initializers/bolt";
import { CallbackId, Command } from "../types/constants";
import { firestore } from "../initializers/firebase";
import dayjs from "dayjs";

app.command(Command.WfhStart, async ({ context, body, ack, payload }) => {
  // コマンドリクエストを確認
  await ack();

  try {
    const dailyReportsRef = firestore.collection("dailyReports");
    // 前日に残した作業をそのまま記載したいが、金曜日だと営業日がわからないので、無理やりorderByで取得する。
    const dailyReportsQuery = dailyReportsRef
      .where("user", "==", body.user_id)
      .orderBy("workDate", "desc")
      .limit(1);

    const dailyReports = await dailyReportsQuery.get().catch((err) => {
      throw new Error(err);
    });

    // JTCに変更する
    const now = dayjs().add(9, "hour");
    const workDate = now.format("YYYY/MM/DD");

    let workingAction = "";
    // 初回登録
    if (!dailyReports.empty) {
      const doc = dailyReports.docs[0];
      const data = doc.data();
      if (data.workDate === workDate) {
        const msg = {
          token: context.botToken,
          text: "既に本日は業務開始しています。",
          channel: payload.channel_id,
          user: payload.user_id,
        };
        await app.client.chat.postEphemeral(msg as any);
        return;
      }
      workingAction = data.workingAction;
    }

    const start = now.format("HHmm");
    const end = now.add(8, "hour").format("HHmm");

    await app.client.views.open({
      token: context.botToken,
      // 適切な trigger_id を受け取ってから 3 秒以内に渡す
      trigger_id: body.trigger_id,
      // view の値をペイロードに含む
      view: {
        type: "modal",
        private_metadata: payload.channel_id,
        callback_id: CallbackId.WfhStart,
        title: {
          type: "plain_text",
          text: "業務開始連絡",
        },
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `作業日付：${workDate}`,
            },
          },
          {
            type: "input",
            block_id: "start",
            label: {
              type: "plain_text",
              text: "開始時刻(実績)",
            },
            element: {
              type: "plain_text_input",
              action_id: "start",
              initial_value: start,
            },
          },
          {
            type: "input",
            block_id: "end",
            label: {
              type: "plain_text",
              text: "終了時刻(予定)",
            },
            element: {
              type: "plain_text_input",
              action_id: "end",
              initial_value: end,
            },
          },
          {
            type: "input",
            block_id: "action",
            label: {
              type: "plain_text",
              text: "業務内容(予定)",
            },
            element: {
              type: "plain_text_input",
              action_id: "action",
              initial_value: workingAction,
              multiline: true,
            },
          },
        ],
        submit: {
          type: "plain_text",
          text: "Submit",
        },
      },
    });
  } catch (error) {
    console.log(error);
    const msg = {
      token: context.botToken,
      text: error,
      channel: payload.channel_id,
      user: payload.user_id,
    };
    await app.client.chat.postEphemeral(msg as any);
  }
});
