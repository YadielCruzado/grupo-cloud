import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/index.js";
import InfoRest from "./pages/infoRest.js";
import Menu from "./components/User/menu.js";
import AdminOwner from "./pages/adminOwner.js";
import AdminRest from "./pages/adminRest.js";
import LogIn from "./pages/Login.js";


export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Index />} />
          <Route path="/home" element={<Index />} />
          <Route path="/information" element={<InfoRest  />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/login" element={<LogIn />} />

          <Route path="/adminOwner" element={<AdminOwner />} />
          <Route path="/adminRest" element={<AdminRest />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
