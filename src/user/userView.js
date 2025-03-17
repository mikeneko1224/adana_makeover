import React from 'react';

function UserView({ contentStarted }) {
  return (
    <div>
      <h2>ユーザー画面</h2>
      {contentStarted && <div>スタートしました！</div>}
    </div>
  );
}

export default UserView;