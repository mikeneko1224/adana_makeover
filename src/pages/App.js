import "styles/App.css";
import { Header } from "component/header";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Howto from "component/howto";

function App() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 15);
    navigate(`/room/${newRoomId}`, { state: { name: name } });
  };

  const handleNameSubmit = () => {
    if (name.trim() !== "") {
      createRoom();
    }
  };

  return (
    <div className="App">
      <Header />
      <div className="children">
        <div className="text_input">
          <div class="text">名前を入力してね！</div>
          <input
            class="form"
            type="text"
            name="text"
            placeholder="例: 北神 未海"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div class="button_block">
          <button class="decide_button" onClick={handleNameSubmit}>
            決定☆彡
          </button>
        </div>
      </div>
      <Howto />
    </div>
  );
}

export default App;
