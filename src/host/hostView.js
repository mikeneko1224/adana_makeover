import React from 'react';

function HostView({ contentStarted, startContent, inviteLink, hostName, gameStage }) {
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      sendImage(file);
    }
  };

  return (
    <div>
      <h2>ホスト画面</h2>
      <div>招待リンク: {inviteLink}</div>
      {!contentStarted && (
        <button onClick={startContent}>スタート</button>
      )}
      {contentStarted && (
        <>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </>
      )}
    </div>
  );
}

export default HostView;