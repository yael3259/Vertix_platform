import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Feed } from "./features/post/Feed";
import { NavBar } from "./NavBar";
import { AddPostForm } from "./features/post/AddPost";





function App() {
  return (
    <div className="app">
      <Router>

        <NavBar />

        <Routes>
          <Route path="" element={<Feed />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/addPost" element={<AddPostForm />} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
