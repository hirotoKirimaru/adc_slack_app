import { app } from "../index";

// モーダルビューでのデータ送信イベントを処理します
app.view("view_1", async ({ ack, body, payload, context }) => {
  // モーダルビューでのデータ送信イベントを確認
  await ack();

  // 入力値を使ってやりたいことをここで実装 - ここでは DB に保存して送信内容の確認を送っている
  //
  // // block_id: block_1 という input ブロック内で action_id: input_a の場合の入力
  // const val = view['state']['values']['block_1']['input_a'];
  const user = body["user"]["id"];

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
  try {
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
