import React from 'react';

function UserView({ contentStarted, hostName }) {
  console.log("contentStartedの値: ", contentStarted);
  
  return (
    <div>
      <h2>ユーザー画面</h2>
      {contentStarted && (
        <div>{hostName}さんがスタートを押すのを待ってるよ</div>
      )}
      {/* {contentStarted && <div>スタートしました！</div>} */}
    </div>
  );
}

export default UserView;