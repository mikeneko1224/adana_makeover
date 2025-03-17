import "styles/App.css";
import { Header } from "component/header";
import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';

function App() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 15);
    navigate(`/room/${newRoomId}`,{state: {name: name}});
  };

  const handleNameSubmit = () => {
    if (name.trim() !== "") {
      createRoom();
    }
  };

  return (
    <div className="App">
      <Header />
      <div className="input_space">
        <div className="text_input">
          <div>名前を入力してね！</div>
          <input
            type="text"
            name="text"
            placeholder="例: 田中 花子"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button onClick={handleNameSubmit}>決定！！</button>
      </div>
    </div>
  );
}

export default App;
