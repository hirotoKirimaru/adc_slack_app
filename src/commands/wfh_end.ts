import { app } from "../initializers/bolt";
import dayjs from "dayjs";
import { CallbackId, Command } from "../types/constants";
import { firestore } from "../initializers/firebase";

app.command(Command.WfhEnd, async ({ context, body, ack, payload }) => {
  // コマンドリクエストを確認
  await ack();

  const dailyReportsRef = firestore.collection("dailyReports");
  const dailyReportsQuery = dailyReportsRef
    .where("user", "==", body.user_id)
    .where("status", "==", "open");

  const dailyReports = await dailyReportsQuery.get().catch((err) => {
    throw Error(err);
  });

  if (dailyReports.docs.length === 0) {
    const msg = {
      token: context.botToken,
      text:
        "締め処理をする業務がありません。業務を開始していない可能性があります。",
      channel: payload.channel_id,
      user: payload.user_id,
    };
    await app.client.chat.postEphemeral(msg as any);
    return;
  }

  const dailyReport = dailyReports.docs[0];
  const dailyReportData = dailyReport.data();

  try {
    await app.client.views.open({
      token: context.botToken,
      // 適切な trigger_id を受け取ってから 3 秒以内に渡す
      trigger_id: body.trigger_id,
      // view の値をペイロードに含む
      view: {
        type: "modal",
        private_metadata: payload.channel_id,
        callback_id: CallbackId.WfhEnd,
        title: {
          type: "plain_text",
          text: "業務終了連絡",
        },
        blocks: [
          {
            type: "input",
            block_id: "workDate",
            label: {
              type: "plain_text",
              text: "作業日",
            },
            element: {
              type: "plain_text_input",
              action_id: "workDate",
              initial_value: "2020-05-02",
              // initial_value : dayjs().format("HHMM")
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
              initial_value: dailyReportData.start,
            },
          },
          {
            type: "input",
            block_id: "end",
            label: {
              type: "plain_text",
              text: "終了時刻(実績)",
            },
            element: {
              type: "plain_text_input",
              action_id: "end",
              initial_value: dailyReportData.end,
            },
          },
          {
            type: "input",
            block_id: "action",
            label: {
              type: "plain_text",
              text: "業務内容(実績)",
            },
            element: {
              type: "plain_text_input",
              action_id: "action",
              initial_value: dailyReportData.action,
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
    console.error(error);
  }
});
