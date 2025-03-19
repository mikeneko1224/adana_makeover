import React from "react";
import { useState } from "react";
import MakeRoom from "./make_room";

function HostView({
  contentStarted,
  startContent,
  inviteLink,
  hostName,
  onlineCount,
  gameStage,
  ws,
}) {
  const [selectedFile, setSelectedFile] = useState(null);

  //ホストのみの操作
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const sendImage = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const image = event.target.result;
        if (ws) {
          ws.send(JSON.stringify({ type: "image", image }));
          ws.send(
            JSON.stringify({ type: "gameStage", gameStage: "sendImage" })
          );
          console.log("Sent image to server");
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const sendAnswer = () => {
    ws.send(JSON.stringify({ type: "gameStage", gameStage: "sendAnswer" }));
  };

  //共通部分
  const [nickname, setNickname] = useState("");
  const [isNicknameSent, setIsNicknameSent] = useState(false);
  const sendName = () => {
    ws.send(JSON.stringify({ type: "nickname", nickname: nickname }));
    ws.send(JSON.stringify({ type: "gameStage", gameStage: "sendName" }));
    setIsNicknameSent(true);
  };
  const badName = () => {
    ws.send(JSON.stringify({ type: "gameStage", gameStage: "badName" }));
  };
  const goodName = () => {
    ws.send(JSON.stringify({ type: "gameStage", gameStage: "choseName" }));
  };

  return (
    <div>
      <h2>ホスト画面</h2>

      {!contentStarted && (
        <>
          <MakeRoom
            ws={ws}
            inviteLink={inviteLink}
            startContent={startContent}
            hostName={hostName}
            onlineCount={onlineCount}
          />
        </>
      )}
      {contentStarted && gameStage === "waitingImage" && (
        <>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          <button onClick={sendImage}>プロフ画像を送信</button>
        </>
      )}
      {contentStarted && gameStage === "waitingQuestion" && (
        <>
          <div>質問を待ってるよ</div>
        </>
      )}
      {contentStarted && gameStage === "waitingAnswer" && (
        <>
          <div>質問に答えよう</div>
          <button onClick={sendAnswer}>回答送信</button>
        </>
      )}
      {contentStarted && gameStage === "thinkingName" && (
        <>
          <div>あだ名を考えよう</div>
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
        </>
      )}
      {contentStarted && gameStage === "choosingName" && (
        <>
          <div>あだ名を選ぼう</div>
          <button onClick={badName}>もう一度</button>
          <button onClick={goodName}>きにいった</button>
        </>
      )}
      {contentStarted && gameStage === "showResult" && (
        <>
          <div>けっかはこんな感じ</div>
        </>
      )}
      {contentStarted && gameStage === "gameOver" && (
        <>
          <div>終了</div>
        </>
      )}
    </div>
  );
}

export default HostView;
