import React from "react";
import { useState } from "react";

function UserView({
  contentStarted,
  hostName,
  gameStage,
  imageData,
  ws,
  nicknames,
  votes,
  questions,
  keyword
}) {
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
  const sendName = () => {
    ws.send(JSON.stringify({ type: "nickname", nickname: nickname }));
    ws.send(JSON.stringify({ type: "gameStage", gameStage: "sendName" }));
    setIsNicknameSent(true);
  };
  const badName = () => {
    ws.send(JSON.stringify({ type: "gameStage", gameStage: "badName" }));
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
    <div>
      <h2>ユーザー画面</h2>
      {!contentStarted && (
        <div>{hostName}さんがスタートを押すのを待ってるよ</div>
      )}
      {contentStarted && gameStage === "waitingImage" && (
        <div>
          <div>{hostName}さんのプロフ画像を待ってるよ</div>
          {imageData && <img src={imageData} alt="プロフ画像" />}
        </div>
      )}
      {contentStarted && gameStage === "waitingQuestion" && (
        <div>
          {imageData && <img src={imageData} alt="プロフ画像" />}
          {!isQuestionSent ? (
            <>
              <div>{hostName}さんに質問しよう</div>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <button onClick={sendQuestion}>質問送信</button>
            </>
          ) : (
            <p>送信済み</p>
          )}
        </div>
      )}
      {contentStarted && gameStage === "waitingAnswer" && (
        <div>
          {imageData && <img src={imageData} alt="プロフ画像" />}
          <div>送った質問</div>
          <div>{questions.map((index)=>{
            return <div key={index}>{index}</div>
          })}</div>
          <div>{hostName}さんの回答を待っているよ</div>
        </div>
      )}
      {contentStarted && gameStage === "thinkingName" && (
        <>
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
        </>
      )}
      {contentStarted && gameStage === "choosingName" && (
        <>
          {!choseName ? (
            <>
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
            </>
          ) : (
            <p>選択済みです</p>
          )}
        </>
      )}
      {contentStarted && gameStage === "showResult" && (
        <>
          <div>けっかはこんな感じ</div>
          <ul>
            {Object.keys(votes).map((nickname, index) => (
              <li key={index}>
                {nickname}: {votes[nickname]}
              </li>
            ))}
          </ul>
          <p>8秒後に画面が変わる</p>
        </>
      )}
      {contentStarted && gameStage === "gameOver" && (
        <>
          <div>ゲーム終了</div>
        </>
      )}
    </div>
  );
}

export default UserView;
