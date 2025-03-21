import React, { useState, useEffect } from "react";
import MakeRoom from "./make_room";
import "styles/wait.css";
import SendAdana from "../component/sendAdana";

function HostView({
  contentStarted,
  startContent,
  inviteLink,
  hostName,
  onlineCount,
  gameStage,
  ws,
  nicknames,
  votes,
  questions,
  keyword,
  remainingTime,
  bonusTimeUsed,

}) {
  const initialState = () => {
    setChoseName(false);
    setAnswer("");
    setNickname("");
  };
  useEffect(() => {
    if (gameStage === "showResult") {
      initialState();
    }
  }, [gameStage]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [answer, setAnswer] = useState("");
  const [nickname, setNickname] = useState("");

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
    ws.send(
      JSON.stringify({
        type: "gameStage",
        gameStage: "sendAnswer",
        answer: answer,
      })
    );
  };

  //共通部分
  const [choseName, setChoseName] = useState(false);
  const badName = () => {
    ws.send(JSON.stringify({ type: "gameStage", gameStage: "badName" }));
    setChoseName(true);
  };
  const goodName = () => {
    ws.send(
      JSON.stringify({
        type: "gameStage",
        gameStage: "choseName",
        choseName: nickname,
      })
    );
    setChoseName(true);
  };

  return (
    <div class="children">
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
        <div className="children_space">
          <label htmlFor="file-upload" class="file-upload-label">
            <div className="file-upload-button">送る写真を選んでね！</div>
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-upload-input"
          />
          {!selectedFile && <p>ファイルを選んでください。</p>}
          {selectedFile && (
            <div className="image-preview">
              <p>選択したファイル：{selectedFile.name}</p>
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="選択した画像"
                className="preview-image"
              />
            </div>
          )}
          <button onClick={sendImage} className="send-button">
            プロフ画像を送信
          </button>
        </div>
      )}
      {contentStarted && gameStage === "waitingQuestion" && (
        <div class="children_space">
          <div class="text">質問を待ってるよ</div>
        </div>
      )}
      {contentStarted && gameStage === "waitingAnswer" && (
        <div class="children_space">
          <div>質問に答えよう</div>
          <div>
            {questions.map((index) => {
              return <div key={index}>{index}</div>;
            })}
          </div>
          <input
            type="text"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
            }}
          />
          <button onClick={sendAnswer}>回答送信</button>
        </div>
      )}
      {contentStarted && gameStage === "thinkingName" && (
        <>
          <SendAdana
            remainingTime={remainingTime}
            bonusTimeUsed={bonusTimeUsed}
            keyword={keyword}
            ws={ws}
            gameStage={gameStage}
          />
        </>
      )}
      {contentStarted && gameStage === "choosingName" && (
        <>
          {!choseName ? (
            <div class="children_space">
              <div>あだ名を選ぼう</div>
              <ul>
                {[...new Set(nicknames)].map((nickname, index) => (
                  <li key={index}>
                    <button onClick={() => goodName(nickname)}>
                      {nickname}
                    </button>
                  </li>
                ))}
              </ul>
              <button onClick={badName}>もう一度</button>
              <button>ひらめいた</button>
            </div>
          ) : (
            <p>選択済みです</p>
          )}
        </>
      )}
      {contentStarted && gameStage === "showResult" && (
        <div class="children_space">
          <div>けっかはこんな感じ</div>
          <ul>
            {Object.keys(votes).map((nickname, index) => (
              <li key={index}>
                {nickname}: {votes[nickname]}
              </li>
            ))}
          </ul>
        </div>
      )}
      {contentStarted && gameStage === "gameOver" && (
        <div class="children_space">
          <div>終了</div>
        </div>
      )}
    </div>
  );
}

export default HostView;
