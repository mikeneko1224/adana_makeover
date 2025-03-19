import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import HostView from "../host/hostView";
import UserView from "../user/userView";

function Room() {
  const { roomId } = useParams();
  const location = useLocation();
  const [onlineCount, setOnlineCount] = useState(0);
  const [ws, setWs] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [contentStarted, setContentStarted] = useState(false);
  const [hostName, setHostName] = useState("");
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    //あだ名を決めたい人の名前持ってきた
    const name = location.state?.name || "匿名";

    if (roomId) {
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
        } else if (message.type === "image") {
          setImageData(message.image);
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
    }
  };

  return (
    <div class="children">
      <div className="Room">
        <h1>{hostName}さんのあだ名を考える</h1>

        {isHost ? (
          <HostView
            contentStarted={contentStarted}
            startContent={startContent}
            inviteLink={window.location.href}
            hostName={hostName}
            ws={ws}
          />
        ) : (
          <UserView
            contentStarted={contentStarted}
            hostName={hostName}
            imageData={imageData}
            ws={ws}
          />
        )}
        <h2>オンライン人数: {onlineCount}</h2>
      </div>
    </div>
  );
}

export default Room;
