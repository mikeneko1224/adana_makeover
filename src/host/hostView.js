import React, { useState, useEffect, useCallback } from "react";
import MakeRoom from "./make_room";
import "styles/wait.css";
import Modal from "../component/modal";
import { buildQueries } from "@testing-library/dom";

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
  isHost,
}) {
  const initialState = () => {
    setChoseName(false);
    setAnswer("");
    setNickname("");
    setIsNicknameSent(false);
    setAudioPlayed(false);
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
  const [isNicknameSent, setIsNicknameSent] = useState(false);
  const [choseName, setChoseName] = useState(false);

  const sendName = useCallback(() => {
    if (nickname) {
      ws.send(JSON.stringify({ type: "nickname", nickname: nickname }));
    }
    ws.send(JSON.stringify({ type: "gameStage", gameStage: "sendName" }));
    setIsNicknameSent(true);
  }, [ws, nickname]);

  useEffect(() => {
    if (isHost) {
      ws.send(
        JSON.stringify({
          type: "log",
          remainingTime: remainingTime,
          isNicknameSent: isNicknameSent,
          bonusTimeUsed: bonusTimeUsed,
        })
      );
    }
    if (remainingTime <= 0 && !isNicknameSent && bonusTimeUsed) {
      ws.send(JSON.stringify({ type: "nickname", nickname: nickname }));
      ws.send(JSON.stringify({ type: "gameStage", gameStage: "sendName" }));
      setIsNicknameSent(true);
    }
  }, [remainingTime, isNicknameSent]);

  const [audioPlayed, setAudioPlayed] = useState(false);
  useEffect(() => {
    if (bonusTimeUsed && !audioPlayed) {
      const audio = new Audio("/bonusTimeStart.wav");
      audio.play();
      setAudioPlayed(true);
    }
  });

  const badName = () => {
    ws.send(JSON.stringify({ type: "gameStage", gameStage: "badName" }));
    setChoseName(true);
  };
  const goodName = (nickname) => {
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
          <label htmlFor="file-upload" className="file-upload-label">
            {!selectedFile ? (
              <div className="file-upload-button">
                <img
                  src="/カメラねこさん.png"
                  alt="アイコン"
                  className="upload-icon"
                />
                <p class="text">送る写真を選ぼう！</p>
                <p class="new_text">クリックして写真を選んでね♪</p>
              </div>
            ) : (
              <div className="file-upload-button">
                <p>選択したファイル：{selectedFile.name}</p>
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="選択した画像"
                  className="preview-image"
                />
              </div>
            )}
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-upload-input"
          />
          <button onClick={sendImage} className="send-button">
            プロフ画像を送信
          </button>
        </div>
      )}

      {contentStarted && gameStage === "waitingQuestion" && (
        <div class="children_space">
          <div class="text">質問を待ってるよ！</div>
        </div>
      )}
      {contentStarted && gameStage === "waitingAnswer" && (
        <div class="children_space">
          <div class="text">質問に答えよう！</div>
          <div>
            {questions.map((index) => {
              return <div key={index}>{index}</div>;
            })}
          </div>
          <input
            type="text"
            value={answer}
            class="answer_form"
            onChange={(e) => {
              setAnswer(e.target.value);
            }}
          />
          <button class="answer_button" onClick={sendAnswer}>
            回答送信
          </button>
        </div>
      )}
      {contentStarted && gameStage === "thinkingName" && (
        <div class="children_space remainingTimeContainer">
          {bonusTimeUsed && <div className="bonus">ボーナスタイム中！</div>}
          <div className="remainingTime">{remainingTime}</div>
          <div class="name_space">
            <div style={{ marginBottom: "20px", fontSize: "20px" }}>
              あだ名を考えよう！
            </div>
            <div>キーワード: {keyword}</div>
            {!isNicknameSent ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendName();
                }}
              >
                <input
                  class="input_name"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
                <button class="send_adana" type="submit">
                  あだ名送信
                </button>
              </form>
            ) : (
              <p>送信済み</p>
            )}
          </div>
        </div>
      )}
      {contentStarted && gameStage === "choosingName" && (
        <>
          {!choseName ? (
            <div class="children_space">
              <div class="text2">あだ名を選ぼう!</div>
              <ul>
                {nicknames.map((nickname, index) => (
                  <li key={nickname}>
                    <button
                      class="select_button"
                      onClick={() => goodName(nickname)}
                    >
                      {nickname}
                    </button>
                  </li>
                ))}
              </ul>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <button class="retry_button" onClick={badName}>
                  もう一度！
                </button>
                <Modal ws={ws} />
              </div>
            </div>
          ) : (
            <p class="text">選択完了！</p>
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
          <div class="text">終了</div>
        </div>
      )}
    </div>
  );
}

export default HostView;
