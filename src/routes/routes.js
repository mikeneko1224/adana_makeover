import { Routes, Route } from "react-router-dom";
import TopPage from "pages/App.js";
import Room from "pages/Room";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TopPage />} />
      <Route path="/room/:roomId" element={<Room />} />
    </Routes>
  );
};