import { Routes, Route } from "react-router-dom";
import TopPage from "./App.js"; // pageA.jsxの読み込み
import SelectQuestion from "./Question.js"; // pageB.jsxの読み込み

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TopPage />} />
      <Route path="/question" element={<SelectQuestion />} />
    </Routes>
  );
};
