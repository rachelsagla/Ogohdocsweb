import { Routes, Route } from 'react-router-dom';
import MainLayout from './layout/mainlayout.jsx';
import Dashboard from './pages/dashboard.jsx';
import Playlist from './pages/playlist.jsx';
import Profile from './pages/profile.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<LoginPage/>} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="playlist" element={<Playlist />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
}

export default App;