import React from "react";
import "styles/make_room.css";
import { Header } from "component/header";

export default function MakeRoom({
  inviteLink,
  startContent,
  hostName,
  onlineCount,
}) {
  return (
    <div>
      <Header />
      <div className="childlen">
        <div>
          {hostName}さんのあだ名を決めるルームを作ったよ！友達に送ろう！
        </div>
        <div className="invite_form">
          <input type="text" value={inviteLink} />
          <div>
            <button>コピー</button>
          </div>
        </div>
        <div>現在のオンライン：{onlineCount}人</div>
        <button onClick={startContent}>スタート</button>
      </div>
    </div>
  );
}
