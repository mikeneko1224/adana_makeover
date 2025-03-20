import React, { useState } from "react";
import "styles/make_room.css";
import { Header } from "component/header";

export default function MakeRoom({
  inviteLink,
  startContent,
  hostName,
  onlineCount,
}) {
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");

  function copy_text() {
    navigator.clipboard.writeText(inviteLink).then(() => {
      setMessage("リンクがコピーされました！"); // メッセージをセット
      setShowMessage(true); // メッセージを表示
    });
  }

  return (
    <div>
      <div className="childlen">
        <div class="children_space">
          <div class="text">
            {hostName}さんのあだ名を決めるルームを作ったよ！友達に送ろう！
          </div>
          <div className="invite_form">
            <input class="URL_form" type="text" value={inviteLink} />
            <button onClick={copy_text} class="copy_button">
              コピー
            </button>
          </div>
          <p
            className="copy_message"
            style={{ visibility: showMessage ? "visible" : "hidden" }}
          >
            {message}
          </p>
          <div class="number_block">
            <div>現在のオンライン：</div>
            <div class="number_people">{onlineCount}人</div>
          </div>
          <button onClick={startContent} class="start_button">
            スタート
          </button>
        </div>
      </div>
    </div>
  );
}
