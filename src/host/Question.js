import React from "react";
import { Header } from "component/header";
import "styles/wait.css";
import { useNavigate } from "react-router-dom";

export default function SelectQuestion() {
  const navigate = useNavigate();
  const startNav = () => {
    navigate("/");
  };

  return (
    <>
      <Header />
      <div className="children">
        <div className="text">質問：好きな食べ物は？</div>
        <input type="text" value="入力" />

        <button onClick={startNav}>決定</button>
      </div>
    </>
  );
}
