import React, { useState, useEffect, useCallback} from "react";

export default function SendAdana({
  remainingTime,
  bonusTimeUsed,
  ws,
  keyword,
}) {
  const [nickname, setNickname] = useState("");
  const [isNicknameSent, setIsNicknameSent] = useState(false);

  const sendName = useCallback(() => {
    ws.send(JSON.stringify({ type: "nickname", nickname: nickname }));
    ws.send(JSON.stringify({ type: "gameStage", gameStage: "sendName" }));
    setIsNicknameSent(true);
    console.log("送信されたあだ名:", nickname || "未入力");
  }, [ws, nickname]);

  if (remainingTime <= 0 && !isNicknameSent && !bonusTimeUsed) {
    sendName();
  }

  return (
    <>
      <div class="children_space">
        {bonusTimeUsed && <div>ボーナスタイム中！</div>}
        <div>残り時間:{remainingTime}</div>
        <div>あだ名を考えよう</div>
        <div>キーワード: {keyword}</div>
        {!isNicknameSent ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendName();
            }}
          >
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <button type="submit">あだ名送信</button>
          </form>
        ) : (
          <p>送信済み</p>
        )}
      </div>
    </>
  );
}