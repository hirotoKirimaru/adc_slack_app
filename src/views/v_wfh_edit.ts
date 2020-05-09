import { app } from "../initializers/bolt";
import { FieldValue, firestore } from "../initializers/firebase";
import { CallbackId } from "../types/constants";
import { DailyReportImpl } from "../domain/dailyReport";

// モーダルビューでのデータ送信イベントを処理します
app.view(CallbackId.WfhEdit, async ({ ack, body, view, context }) => {
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
    const action =
      payload.action.action.value !== undefined
        ? payload.action.action.value
        : "";
    const workingAction =
      payload.workingAction.workingAction.value !== undefined
        ? payload.workingAction.workingAction.value
        : "";
    const timestamp = await FieldValue.serverTimestamp();

    const dailyReports = await dailyReportsQuery.get();

    dailyReports.docs.forEach((dailyReport) => {
      const dailyReportData: DailyReportImpl = dailyReport.data() as DailyReportImpl;
      const workend = DailyReportImpl.workEdit(
        action,
        workingAction,
        timestamp
      );

      batch.update(dailyReport.ref, workend);
    });

    await batch.commit();

    // ユーザーにメッセージを送信
    await app.client.chat.postEphemeral({
      token: context.botToken,
      channel: body.view.private_metadata,
      user: user,
      text: "作業中や未着手のテストの更新を行いました",
    });
  } catch (error) {
    console.error(error);
  }
});
