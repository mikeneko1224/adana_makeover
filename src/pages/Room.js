import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import HostView from "../host/hostView";
import UserView from "../user/userView";
import { Header } from "component/header";

function Room() {
  const { roomId } = useParams();
  const location = useLocation();
  const [onlineCount, setOnlineCount] = useState(0);
  const [ws, setWs] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [contentStarted, setContentStarted] = useState(false);
  const [hostName, setHostName] = useState("");
  const [gameStage, setGameStage] = useState("notStarted");
  const [imageData, setImageData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [nicknames, setNicknames] = useState([]);
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    //あだ名を決めたい人の名前持ってきた
    const name = location.state?.name || "匿名";

    if (roomId) {
      //デプロイ時はこっち
      // const websocket = new WebSocket(`wss://adana-makeover.onrender.com/ws/${roomId}`);
      //ローカルで動かすときはこっち
      const websocket = new WebSocket(`ws://127.0.0.1:8000/ws/${roomId}`);

      websocket.onopen = () => {
        console.log("Connected to server");
        websocket.send(JSON.stringify({ type: "join", name }));
      };

      websocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("Received message from server:", message);
        if (message.type === "onlineCount") {
          setOnlineCount(message.count);
        } else if (message.type === "host") {
          setIsHost(message.isHost);
          if (message.isHost) {
            setHostName(name);
          }
        } else if (message.type === "contentStarted") {
          setContentStarted(true);
        } else if (message.type === "hostName") {
          setHostName(message.name);
        } else if (message.type === "gameStage") {
          setGameStage(message.gameStage);
          if (gameStage === "gameOver") {
            websocket.close();
          }
        } else if (message.type === "image") {
          setImageData(message.image);
        } else if (message.type === "questions") {
          setQuestions(message.questions);
        } else if (message.type === "keyword") {
          setKeyword(message.keyword);
        } else if (message.type === "nicknames") {
          console.log(message.nicknames);
          setNicknames(message.nicknames);
        } else if (message.type === "votes") {
          setVotes(message.votes);
        }
      };

      setWs(websocket);

      return () => {
        console.log("Disconnected from server");
        websocket.close();
      };
    }
  }, [roomId, isHost]);

  const startContent = () => {
    setContentStarted(true);
    if (ws) {
      ws.send(JSON.stringify({ type: "startContent" }));
      ws.send(JSON.stringify({ type: "gameStage", gameStage: "gameStart" }));
    }
  };

  return (
    <div className="Room">
      <Header />
      <h1 class="room_title">〜{hostName}さんのあだ名を考える部屋〜</h1>

      {isHost ? (
        <HostView
          contentStarted={contentStarted}
          startContent={startContent}
          inviteLink={window.location.href}
          hostName={hostName}
          onlineCount={onlineCount}
          gameStage={gameStage}
          ws={ws}
          imageData={imageData}
          questions={questions}
          keyword={keyword}
          nicknames={nicknames}
          votes={votes}
        />
      ) : (
        <UserView
          contentStarted={contentStarted}
          hostName={hostName}
          onlineCount={onlineCount}
          gameStage={gameStage}
          ws={ws}
          imageData={imageData}
          questions={questions}
          keyword={keyword}
          nicknames={nicknames}
          votes={votes}
        />
      )}
    </div>
  );
}

export default Room;
