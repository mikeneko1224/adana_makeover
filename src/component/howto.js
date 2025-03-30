import Swal from "sweetalert2";
import "../styles/howto.css";
import { wait } from "@testing-library/user-event/dist/utils";

export default function Howto() {
  const showAlert = () => {
    Swal.fire({
      title: "使い方",
      html: `
        <p class="kome">※このゲームは途中で音が鳴ります。</p>
        <p class="kome">また、対面や通話しながらでのご利用を推奨します。</p>
        <p class="kome">ルームの作成に1分程度時間がかかることがあります。少々お待ちください...</p>
        <h3>1. 名前を入力してルームを作成</h3>
        <p>あだ名を決めたい人自身がルームを作成してね！</p>
        <p>合計2人以上が入室でゲームをスタートできるよ</p>
        <h3>2. プロフ帳を送ろう</h3>
        <p>部屋を作った人は自己紹介をまとめた画像を送信してね</p>
        <p class="kome">ゲーム開始前に用意しておくことをオススメします</p>
        <a href="/profile_tmp.png" download="profile_tmp.png">テンプレートをダウンロードする</a>
        <h3>3. 質問してみよう</h3>
        <p>参加者はプロフ帳を見て気になることを質問しちゃおう</p>
        <p>部屋を作った人は好きな質問に回答してね</p>
        <h3>4. 連想してみよう</h3>
        <p>質問への回答をもとにあだなを考えてみよう</p>
        <h3>5. 投票してみよう</h3>
        <p>一番気に入ったあだ名に投票してね！</p>
        <p>みんなの回答を見て新しいあだ名を思いついたら</p>
        <div><button class="hirameki_button">ひらめいた!</button><p>から追加できるよ！</p></div>
        <h3>6. けっか発表～</h3>
        <p>全体の投票結果が表示されるよ！</p>
        <p>半分以上が</p>
        <button class="retry_button">もう一度！</button>
        <p>に投票すると、3に戻るよ！</p>
        <p class="kome">@2025 KUF-UME</p>
      `,
      icon: "question",
      confirmButtonText: "戻る",
      confirmButtonColor: "#c5a3d3",
    });
  };

  return (
    <button className="text howto" onClick={showAlert}>ルール説明</button>
  );
}