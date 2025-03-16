import { Routes, Route } from "react-router-dom";
import TopPage from "pages/App.js"; // pageA.jsxの読み込み
import SelectQuestion from "pages/Question.js"; // pageB.jsxの読み込み

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TopPage />} />
      <Route path="/question" element={<SelectQuestion />} />
    </Routes>
  );
};
