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
          console.log("Sent image to server");
        }
      };
      reader.readAsDataURL(selectedFile);
    }
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
      {contentStarted && (
        <>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          <button onClick={sendImage}>プロフ画像を送信</button>
        </>
      )}
    </div>
  );
}

export default HostView;
