import { Routes, Route } from "react-router-dom";
import TopPage from "pages/App.js"; // pageA.jsxの読み込み
import SelectQuestion from "pages/Question.js"; // pageB.jsxの読み込み
import Room from "pages/Room";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TopPage />} />
      <Route path="/question" element={<SelectQuestion />} />
      <Route path="/room/:roomId" element={<Room />} />
    </Routes>
  );
};
