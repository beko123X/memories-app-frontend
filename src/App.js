import {Container} from "@mui/material";

import "./index.css";
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./components/Auth/Auth";
import PostDetails from "./components/PostDetails/PostDetails";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  const user = JSON.parse(localStorage.getItem('profile'));
  return (
    <BrowserRouter>
      <Container maxWidth="xl">
          <ScrollToTop /> {/* نضعه هنا ليراقب كل التنقلات */}

        <Navbar/>
        <Routes>
          {/* This redirects from / to /posts */}
          <Route path="/" element={<Navigate to="/posts" replace />}/>
          <Route path="/posts" element={<Home />}/>
          <Route path="/posts/search" element={<Home/>}/>
          <Route path="/posts/:id" element={<PostDetails />}/>
          <Route path="/auth" element={!user ? <Auth/> : <Navigate to='/posts' replace/>}/>
        </Routes>

      </Container>
    </BrowserRouter>
  
  )
}

export default App;