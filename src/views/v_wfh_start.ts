import { app } from "../initializers/bolt";
import { FieldValue, firestore } from "../initializers/firebase";
import { CallbackId } from "../types/constants";

// モーダルビューでのデータ送信イベントを処理します
app.view(CallbackId.WfhStart, async ({ ack, body, payload, context }) => {
  // モーダルビューでのデータ送信イベントを確認
  await ack();

  try {
    const dailyReportsRef = firestore.collection("dailyReports");
    // const batch = firestore.batch();

    const user = body["user"]["id"];

    const report = {
      user: user,
      registerDate: "2020/05/02",
      start: "2020/05/02 08:00",
      end: "2020/05/02 15:00",
      status: "started",
      text: "きょうやること",
    };

    await dailyReportsRef.add(report).catch((err: any) => {
      throw new Error(err);
    });

    // await batch.commit();
    // 入力値を使ってやりたいことをここで実装 - ここでは DB に保存して送信内容の確認を送っている
    //
    // // block_id: block_1 という input ブロック内で action_id: input_a の場合の入力
    // const val = view['state']['values']['block_1']['input_a'];

    //
    // // ユーザーに対して送信するメッセージ
    // let msg = '';
    // // DB に保存
    // const results = await db.set(user.input, val);
    //
    // if (results) {
    //   // DB への保存が成功
    //   msg = 'Your submission was successful';
    // } else {
    //   msg = 'There was an error with your submission';
    // }

    // ユーザーにメッセージを送信

    await app.client.chat.postEphemeral({
      token: context.botToken,
      channel: body.view.private_metadata,
      // channel: payload.,
      user: user,
      text: "ごりら",
    });
  } catch (error) {
    console.error(error);
  }
});
