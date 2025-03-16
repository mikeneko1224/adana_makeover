import "styles/App.css";
import { Header } from "component/header";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const nameForm = () => {
    navigate("/question");
  };

  return (
    <div className="App">
      <Header />
      <div className="input_space">
        <div className="text_input">
          <div>名前を入力してね！</div>
          <input type="text" name="text" value="例：田中 花子" />
        </div>
        <button onClick={nameForm}>決定！！</button>
      </div>
    </div>
  );
}

export default App;
