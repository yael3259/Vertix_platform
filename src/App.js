import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Feed } from "./pages/Feed";
import "./App.css"
import { NavBar } from "./components/NavBar";
import LoginForm from './pages/user/Log-in';
import { UserProvider } from "./contexts/UserContext";
import { AddPostForm } from "./pages/post/AddPost";
import { RegistrationPage } from "./pages/user/Sign-in";
import { ProfilePage } from "./pages/user/ProfilePage";
import { ResetPassword } from "./pages/user/ForgotPassword";
import { TrackingTable } from "./pages/achievement/TrackingTable";
import { NetworkList } from "./pages/user/NetworkList";
import { Contact } from "./pages/Contact";
import { AddAchievement } from "./pages/achievement/AddAchievement";



function App() {
  return (
    <div className="app">
      <UserProvider>
        <NavBar />

        <Routes>
          <Route path="" element={<Feed />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/addPost" element={<AddPostForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signin" element={<RegistrationPage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/reset_pass" element={<ResetPassword />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/network/:userId" element={<NetworkList />} />
          <Route path="/table/:achievementId" element={<TrackingTable />} />
          <Route path="/addAchievement" element={<AddAchievement />} />
          {/* <Route path="/notifications" element={<Notifications />} /> */}
          {/* <Route path="/addAchievement" element={<AddAchievement />} /> */}
        </Routes>

      </UserProvider>
    </div>
  );
}

export default App;
