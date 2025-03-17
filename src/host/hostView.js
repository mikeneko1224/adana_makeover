import React from 'react';

function HostView({ contentStarted, startContent, inviteLink }) {
  return (
    <div>
      <h2>ホスト画面</h2>
      <div>招待リンク: {inviteLink}</div>
      {!contentStarted && (
        <button onClick={startContent}>スタート</button>
      )}
      {contentStarted && <div>スタートしました！</div>}
    </div>
  );
}

export default HostView;