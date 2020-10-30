import { app } from "../initializers/bolt";
import { FieldValue, firestore } from "../initializers/firebase";
import { CallbackId } from "../types/constants";
import { DailyReportImpl } from "../domain/dailyReport";

// モーダルビューでのデータ送信イベントを処理します
app.view(CallbackId.WfhEnd, async ({ ack, body, view, context }) => {
  // モーダルビューでのデータ送信イベントを確認
  await ack();

  try {
    const user = body["user"]["id"];

    const dailyReportsRef = firestore.collection("dailyReports");
    const dailyReportsQuery = dailyReportsRef
      .where("user", "==", user)
      .where("status", "==", "open");
    const batch = firestore.batch();

    const payload = (view.state as any).values;
    const start = payload.start.start.value;
    const end = payload.end.end.value;
    const action =
      payload.action.action.value == null
        ? ""
        : payload.action.action.value;
    const workingAction =
      payload.workingAction.workingAction.value == null
        ? ""
        : payload.workingAction.workingAction.value;
    const timestamp = await FieldValue.serverTimestamp();

    const dailyReports = await dailyReportsQuery.get();

    let workDate = "";
    dailyReports.docs.forEach((dailyReport) => {
      const dailyReportData: DailyReportImpl = dailyReport.data() as DailyReportImpl;
      workDate = dailyReportData.workDate;

      const workend = DailyReportImpl.workEnd(
        end,
        action,
        workingAction,
        timestamp
      );

      batch.update(dailyReport.ref, workend);
    });

    await batch.commit();

    // ユーザーにメッセージを送信
    const message = `【${workDate}】
◆業務終了連絡
・開始時刻(実績)：${start}
・終了時刻(実績)：${end}
・業務内容(実績)
【完了済】
${action}
【作業中及び未着手】
${workingAction}`;

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
