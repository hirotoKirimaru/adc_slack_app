import { app } from "../initializers/bolt";
import { firestore } from "../initializers/firebase";
import { CallbackId } from "../types/constants";
import dayjs from "dayjs";

// モーダルビューでのデータ送信イベントを処理します
app.view(CallbackId.WfhStart, async ({ ack, body, view, context }) => {
  // モーダルビューでのデータ送信イベントを確認
  await ack();

  try {
    const dailyReportsRef = firestore.collection("dailyReports");
    // const batch = firestore.batch();

    const payload = (view.state as any).values;
    const workDate = payload.workDate.workDate.value;
    const start = payload.start.start.value;
    const end = payload.end.end.value;
    const action = payload.action.action.value;

    const user = body["user"]["id"];

    const report = {
      user: user,
      workDate: workDate,
      start: start,
      end: end,
      status: "open",
      text: action,
      registerDate: "",
      updateDate: "",
    };

    await dailyReportsRef.add(report).catch((err: any) => {
      throw new Error(err);
    });

    // ユーザーにメッセージを送信
    const message = `【${workDate}】
◆業務開始連絡
・開始時刻(実績)：${start}
・終了時刻(予定)：${end}
・業務内容(予定)
${action}`;

    await app.client.chat.postEphemeral({
      token: context.botToken,
      channel: body.view.private_metadata,
      // channel: payload.,
      user: user,
      text: message,
    });
  } catch (error) {
    console.error(error);
  }
});
