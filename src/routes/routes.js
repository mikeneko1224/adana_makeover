import { Routes, Route } from "react-router-dom";
import TopPage from "host/App.js"; // pageA.jsxの読み込み
import SelectQuestion from "host/Question.js"; // pageB.jsxの読み込み
import MakeRoom from "host/make_room";
import Wait from "host/wait";
import Room from "pages/Room";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TopPage />} />
      {/* <Route path="/room" element={<MakeRoom />} /> */}
      <Route path="/wait" element={<Wait />} />
      <Route path="/question" element={<SelectQuestion />} />
      <Route path="/room/:roomId" element={<Room />} />
    </Routes>
  );
};
