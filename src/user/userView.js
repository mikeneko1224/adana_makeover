import React , { useState, useEffect } from "react";

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
}) {
  const initialState = () => {
    setIsQuestionSent(false);
    setIsNicknameSent(false);
    setChoseName(false);
    setNickname("");
  };
  useEffect(() => {
    if (gameStage === "showResult") {
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
  const sendName = () => {
    ws.send(JSON.stringify({ type: "nickname", nickname: nickname }));
    ws.send(JSON.stringify({ type: "gameStage", gameStage: "sendName" }));
    setIsNicknameSent(true);
  };
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
    <div>
      {!contentStarted && (
        <div class="children">
          <div class="children_space">
            <div>{hostName}さんがスタートを押すのを待ってるよ</div>
          </div>
        </div>
      )}

      {contentStarted && gameStage === "waitingImage" && (
        <div class="children">
          <div class="children_space">
            <div>{hostName}さんのプロフ画像を待ってるよ</div>
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
                <div>{hostName}さんに質問しよう</div>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                <button onClick={sendQuestion}>質問送信</button>
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
              <div>送った質問</div>
              <div>
                {questions.map((index) => {
                  return <div key={index}>{index}</div>;
                })}
              </div>
              <div>{hostName}さんの回答を待っているよ</div>
            </div>
          </div>
        </div>
      )}
      {contentStarted && gameStage === "thinkingName" && (
        <div class="children">
          <div class="children_space">
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
        </div>
      )}
      {contentStarted && gameStage === "choosingName" && (
        <>
          {!choseName ? (
            <div class="children">
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
            </div>
          ) : (
            <div class="children">
              <div class="children_space">
                <p>選択済みです</p>
              </div>
            </div>
          )}
        </>
      )}
      {contentStarted && gameStage === "showResult" && (
        <div class="children">
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
        </div>
      )}
      {contentStarted && gameStage === "gameOver" && (
        <div class="children">
          <div class="children_space">
            <div>ゲーム終了</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserView;
