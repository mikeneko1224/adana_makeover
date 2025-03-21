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
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}
