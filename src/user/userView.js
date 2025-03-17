import React from 'react';

function UserView({ contentStarted, hostName, imageData }) {
  
  return (
    <div>
      <h2>ユーザー画面</h2>
      {!contentStarted && (
        <div>{hostName}さんがスタートを押すのを待ってるよ</div>
      )}
      {contentStarted && (
        <div>
          <div>{hostName}さんのプロフ画像を待ってるよ</div>
          {imageData && <img src={imageData} alt="プロフ画像" />}
        </div>
      )}
    </div>
  );
}

export default UserView;