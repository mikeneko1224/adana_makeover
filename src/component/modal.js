import Swal from "sweetalert2";

export default function Modal({ ws }) {
  const showAlert = () => {
    Swal.fire({
      title: "ひらめいた！",
      input: "text",
      inputPlaceholder: "もっと思いついちゃった？",
      showCancelButton: true,
      confirmButtonText: "提案！",
      cancelButtonText: "キャンセル",
      preConfirm: (inputValue) => {
        if (!inputValue) {
          Swal.showValidationMessage("入力できてないよ");
          return false;
        }
        return inputValue;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newNickname = result.value;
        ws.send(JSON.stringify({ type: "nickname", nickname: newNickname }));
      } else if (result.isDismissed) {
        console.log("キャンセル");
      }
    });
  };

  return (
    <button class="hirameki_button" onClick={showAlert}>
      ひらめいた！
    </button>
  );
}
