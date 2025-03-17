import React from "react";
import "styles/make_room.css";
import { Header } from "component/header";
import { useNavigate } from "react-router-dom";

export default function MakeRoom() {
  const navigate = useNavigate();
  const startNav = () => {
    navigate("/wait");
  };

  return (
    <div>
      <Header />
      <div className="childlen">
        <div>Aさんのあだ名を決めるルームを作ったよ！友達に送ろう！</div>
        <div className="invite_form">
          <input type="text" value="招待用リンク" />
          <div>
            <button>コピー</button>
          </div>
        </div>
        <div>現在のオンライン：⚪︎人</div>
        <button onClick={startNav}>スタート</button>
      </div>
    </div>
  );
}
