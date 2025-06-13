import { Routes, Route } from "react-router-dom";
// import "antd/dist/reset.css";
// import "./assets/styles/main.css";
// import "./assets/styles/responsive.css";
// import "./assets/styles/adaptive.css";

// import Dashboard from "./pages/dashboard";
import MainLayout from "./layout/mainlayout";
import Playlist from "./pages/playlist";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Playlist />} />
          <Route path="playlist" element={<Playlist />} />
          <Route path="dashboars" element={<div>Profile Page Content</div>} />
          <Route path="post" element={<div>Post Page Content</div>} />
          <Route path="profile" element={<div>Profile Page Content</div>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;