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
      <div>
        <input type="text" name="text" value="名前を入力してね" />
        <button onClick={nameForm}>決定！！</button>
      </div>
    </div>
  );
}

export default App;
