import React, { useState, useEffect, useCallback } from "react";
import Modal from "../component/modal";
import "styles/userView.css";

function UserView({
  contentStarted,
  hostName,
  gameStage,
  imageData,
  ws,
  nicknames,
  votes,
  questions,
  keyword,
  remainingTime,
  bonusTimeUsed,
}) {
  const initialState = () => {
    setQuestion("");
    setIsQuestionSent(false);
    setChoseName(false);
    setNickname("");
    setIsNicknameSent(false);
    setAudioPlayed(false);
  };

  useEffect(() => {
    if (gameStage === "waitingQuestion") {
      initialState();
    }
  }, [gameStage]);

  //ユーザーのみの操作
  const [question, setQuestion] = useState("");
  const [isQuestionSent, setIsQuestionSent] = useState(false);
  const sendQuestion = () => {
    if (gameStage === "waitingQuestion") {
      ws.send(
        JSON.stringify({
          type: "gameStage",
          gameStage: "sendQuestion",
          question: question,
        })
      );
      setIsQuestionSent(true);
    }
  };

  //共通部分
  const [nickname, setNickname] = useState("");
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
    if (
      remainingTime <= 0 &&
      !isNicknameSent &&
      bonusTimeUsed &&
      gameStage === "thinkingName"
    ) {
      ws.send(JSON.stringify({ type: "nickname", nickname: nickname }));
      ws.send(JSON.stringify({ type: "gameStage", gameStage: "sendName" }));
      setIsNicknameSent(true);
    }
  }, [remainingTime, isNicknameSent, ws, nickname]);

  const [audioPlayed, setAudioPlayed] = useState(false);
  
  useEffect(() => {
    if (bonusTimeUsed && !audioPlayed) {
      const audio = new Audio("/bonusTimeStart.mp3");
      audio.play();
      setAudioPlayed(true);
    }
  }, [bonusTimeUsed, audioPlayed]);

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
    <div>
      {!contentStarted && (
        <div class="children">
          <div class="children_space">
            <div class="text">
              {hostName}さんがスタートを押すのを待ってるよ！
            </div>
          </div>
        </div>
      )}

      {contentStarted && gameStage === "waitingImage" && (
        <div class="children">
          <div class="children_space">
            <div class="text">{hostName}さんのプロフ画像を待ってるよ！</div>
            {imageData && <img src={imageData} alt="プロフ画像" />}
          </div>
        </div>
      )}

      {contentStarted && gameStage === "waitingQuestion" && (
        <div>
          {!isQuestionSent ? (
            <div class="children">
              <div class="children_space">
                {imageData && (
                  <img
                    style={{ width: "100%" }}
                    src={imageData}
                    alt="プロフ画像"
                  />
                )}
                <div class="text">{hostName}さんに質問しよう！！</div>
                <input
                  type="text"
                  placeholder="質問を入力してね"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                <button class="send_question" onClick={sendQuestion}>
                  質問送信
                </button>
              </div>
            </div>
          ) : (
            <p>送信済み</p>
          )}
        </div>
      )}
      {contentStarted && gameStage === "waitingAnswer" && (
        <div>
          <div class="children">
            <div class="children_space">
              {imageData && (
                <img
                  style={{ width: "100%" }}
                  src={imageData}
                  alt="プロフ画像"
                />
              )}
              <div class="text">
                <div class="text questions">▼みんなが送った質問▼</div>
                <div class="text questions">
                  {questions.map((question, index) => {
                    return (
                      <div key={index}>
                        {index % 2 === 0 ? "◇" : "◆"} {question}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div class="text">{hostName}さんの回答を待っているよ！</div>
            </div>
          </div>
        </div>
      )}
      {contentStarted && gameStage === "thinkingName" && (
        <div class="children">
          <div class="children_space remainingTimeContainer">
            {bonusTimeUsed && <div className="bonus">ボーナスタイム中！</div>}
            <div className="remainingTime">{remainingTime}</div>
            <div class="name_space">
              <div style={{ marginBottom: "20px", fontSize: "20px" }}>
                あだ名を考えよう
              </div>
              <div className="text">キーワード</div>
              <div className="text">{keyword}</div>
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
                <p className="text">送信済み</p>
              )}
            </div>
          </div>
        </div>
      )}
      {contentStarted && gameStage === "choosingName" && (
        <>
          {!choseName ? (
            <div class="children">
              <div class="children_space">
                <div>あだ名を選ぼう!</div>
                <ul class="select_space">
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
            </div>
          ) : (
            <div class="children">
              <div class="children_space">
                <p class="text">選択完了！</p>
              </div>
            </div>
          )}
        </>
      )}
      {contentStarted && gameStage === "backToQuestion" && (
        <div class="children">
          <div class="children_space">
            <div className="text">まだ舞える！数秒後に質問に戻るよ～</div>
            <ul>
              {Object.keys(votes).map((nickname, index) => (
                <li key={index}>
                  {nickname}: {votes[nickname]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {contentStarted && gameStage === "showResult" && (
        <div class="children">
          <div class="children_space">
            <div>けっかが集まったよ☆</div>
            <ul>
              {Object.keys(votes).map((nickname, index) => (
                <li key={index}>
                  {nickname}: {votes[nickname]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {contentStarted && gameStage === "gameOver" && (
        <div class="children_space">
          <div class="text">ゲーム終了</div>
          {Object.keys(votes).length > 0 && (
            <div class="text adana_result">
              {Object.entries(votes)
                .filter(
                  ([nickname, count]) =>
                    count === Math.max(...Object.values(votes))
                )
                .map(([nickname]) => nickname)
                .join(", ")}
            </div>
          )}
          <div class="text">さっそく呼んでみて！</div>
        </div>
      )}
    </div>
  );
}

export default UserView;
