import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Feed } from "./pages/Feed";
import "./App.css"
import { NavBar } from "./components/NavBar";
import { LoginForm } from "./pages/user/Log-in";
import { UserProvider } from "./contexts/UserContext";
import { AddPostForm } from "./pages/post/AddPost";
import { RegistrationPage } from "./pages/user/Sign-in";
import { ProfilePage } from "./pages/user/ProfilePage";
import { ResetPassword } from "./pages/user/ForgotPassword";
import { TrackingTable } from "./pages/achievement/TrackingTable";
import { NetworkList } from "./pages/user/NetworkList";
import { Contact } from "./pages/Contact";
import { LeaderBoard } from "./pages/LeaderBoard";
import { AddAchievement } from "./pages/achievement/AddAchievement";
import { BoostInvite } from "./components/BoostInvite";
import { NotificationsList } from "./pages/user/notificationsList";
import { SinglePost } from "./pages/post/SinglePost";
import { EditForm } from "./pages/user/EditDetails";
import { EarningPointsAlert } from "./components/EarningPointsAlert";
import { FollowAlert } from "./components/FollowAlert";
import { FavoritePostAlert } from "./components/FavoritePostAlert";
import { EditOptionsMenu } from "./components/EditOptionsMenu";


function App() {
  return (
    <div className="app">
      <UserProvider>
        <NavBar />
        <Routes>
          <Route path="" element={<Feed />} />
          {/* <Route path="*" exact component={<NotFoundPage />} /> */}
          <Route path="/feed" element={<Feed />} />
          <Route path="/addPost" element={<AddPostForm />} />
          <Route path="/addPost/:descriptionForPost" element={<AddPostForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signin" element={<RegistrationPage />} />
          <Route path="/reset_pass" element={<ResetPassword />} />
          <Route path="/editOption" element={<EditOptionsMenu />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/board" element={<LeaderBoard />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/profile/network/:userId" element={<NetworkList />} />
          <Route path="/profile/table/:itemId" element={<TrackingTable />} />
          <Route path="/profile/addAchievement" element={<AddAchievement />} />
          <Route path="/profile/boost" element={<BoostInvite />} />
          <Route path="/profile/points_alert" element={<EarningPointsAlert />} />
          <Route path="/profile/follow_alert" element={<FollowAlert />} />
          <Route path="/profile/favorite-post_alert" element={<FavoritePostAlert />} />
          <Route path="/profile/addAchievement/:boost" element={<AddAchievement />} />
          <Route path="/notifications" element={<NotificationsList />} />
          <Route path="/profile/single_post/:postId" element={<SinglePost />} />
          <Route path="/profile/edit" element={<EditForm />} />
        </Routes>

      </UserProvider>
    </div>
  );
}

export default App;
