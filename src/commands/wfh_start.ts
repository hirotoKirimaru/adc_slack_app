import { app } from "../initializers/bolt";
import dayjs from "dayjs";
import { CallbackId, Command } from "../types/constants";

app.command(Command.WfhStart, async ({ context, body, ack, payload }) => {
  // コマンドリクエストを確認
  await ack();

  try {
    const date = new Date();
    const now =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    //
    // ;
    // const blocks = await createBlocks();
    // const now = dayjs().format("YYYY-MM-DD");

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
          // {
          //   type: "section",
          //   block_id: "registerDate",
          //   text: {
          //     type: "mrkdwn",
          //     text: "作業日",
          //   },
          //   accessory: {
          //     type: "datepicker",
          //     initial_date: now,
          //     placeholder: {
          //       type: "plain_text",
          //       text: "Select a date",
          //       emoji: true,
          //     },
          //   },
          // },
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
              initial_value : "2020-05-02",
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
              initial_value : "0900",
              // initial_value : dayjs().format("HHMM")
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
              initial_value: "1800"
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
