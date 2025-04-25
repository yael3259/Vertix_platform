import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Feed } from "./features/post/Feed";
import "./App.css"
import { NavBar } from "./NavBar";
import LoginForm from './features/user/loginPage';
import { UserProvider } from "./contexts/user_context";
import { AddPostForm } from "./features/post/AddPost";
import { RegistrationPage } from "./features/user/sign_in";
import { ProfilePage } from "./features/user/profilePage";
import { ResetPassword } from "./features/user/forgotPassword";
import { TrackingTable } from "./features/achievement/trackingTable";
import { AddAchievement } from "./features/achievement/addAchievement";



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
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/reset_pass" element={<ResetPassword />} />
            <Route path="/table" element={<TrackingTable />} />
            <Route path="/addAchievement" element={<AddAchievement />} />

          </Routes>

        </UserProvider>
    </div>
  );
}

export default App;
