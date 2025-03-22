export default function GameProgress({ gameStage }) {
  const stageProgress = {
    notStarted: 0,
    waitingImage: 10,
    waitingQuestion: 30,
    waitingAnswer: 50,
    thinkingName: 70,
    choosingName: 90,
    showResult: 100,
  };

  const progress = stageProgress[gameStage] || 0;

  return (
    <div className="GameProgress">
      <div className="progress-container" style={{ position: "relative" }}>
        <div
          className="progress-bar"
          style={{
            width: `${progress}%`,
            height: "20px",
            backgroundColor: "#8ac9ee",
            borderRadius: "5px",
            transition: "width 0.3s ease",
          }}
        ></div>
        <img
          src="/お手紙ねこさん.PNG"
          className="icon"
          style={{
            position: "absolute",
            top: "-10px", // アイコンをバーの上に配置
            left: `calc(${progress}% - 29px)`, // アイコンが進行状況に合わせて動く
            transition: "left 0.3s ease", // アイコンの動きをスムーズに
            zIndex: 10,
          }}
        />
      </div>
    </div>
  );
}
