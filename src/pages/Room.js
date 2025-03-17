import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import "styles/Room.css";

function Room() {
  const { roomId } = useParams();
  const location = useLocation();
  const [onlineCount, setOnlineCount] = useState(0);
  const [ws, setWs] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [contentStarted, setContentStarted] = useState(false);
  const [hostName, setHostName] = useState("");

  useEffect(() => {
    //あだ名を決めたい人の名前持ってきた
    const name = location.state?.name || "匿名";
    setHostName(name);

    if (roomId) {
      const websocket = new WebSocket(`ws://127.0.0.1:8000/ws/${roomId}`);

      websocket.onopen = () => {
        console.log("Connected to server");
        websocket.send(`${name} join room`);
      };

      websocket.onmessage = (event) => {
        const message = event.data;
        console.log("Received message from server:", message);
        if (message.startsWith("オンライン人数: ")) {
          setOnlineCount(parseInt(message.replace("オンライン人数: ", "")));
        }
        if (message === "Content started") {
          setContentStarted(true);
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
      ws.send("Content started");
    }
  };

  return (
    <div className="Room">
      <h1>ルームID: {roomId}</h1>
      <h1>{hostName}さんの名前を考える</h1>
      <h2>オンライン人数: {onlineCount}</h2>
      {isHost ? (
        <div>
          <h2>ホスト画面</h2>
          <div>招待リンク: {window.location.href}</div>
          {!contentStarted && (
            <button onClick={startContent}>スタート</button>
          )}
          {contentStarted && <div>スタートしました！</div>}
        </div>
      ) : (
        <div>
          <h2>ユーザー画面</h2>
          {contentStarted && <div>スタートしました！</div>}
        </div>
      )}
    </div>
  );
}

export default Room;