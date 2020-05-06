import { app } from "../initializers/bolt";
import { FieldValue, firestore } from "../initializers/firebase";
import { CallbackId } from "../types/constants";
import dayjs from "dayjs";
import { Status, DailyReport } from "../domain/dailyReport";

// モーダルビューでのデータ送信イベントを処理します
app.view(CallbackId.WfhStart, async ({ ack, body, view, context }) => {
  // モーダルビューでのデータ送信イベントを確認
  await ack();

  try {
    const dailyReportsRef = firestore.collection("dailyReports");

    const now = new Date();
    const workDate = dayjs(now).format("YYYY/MM/DD");
    const payload = (view.state as any).values;
    const start = payload.start.start.value;
    const end = payload.end.end.value;
    const action = payload.action.action.value;
    const timestamp = await FieldValue.serverTimestamp();

    const user = body["user"]["id"];

    const report: DailyReport = {
      user: user,
      workDate: workDate,
      start: start,
      end: end,
      status: Status.Open,
      action: action,
      registerDate: timestamp,
      updateDate: timestamp,
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
