import React from "react"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./Header-Footer/Header"
import Index from "./portfolio/Index"
import Login from "./Authentication/Login";
import Register from "./Authentication/Register";
import Forgot from "./Authentication/Forgot";
import HomeDoctor from "./home/HomeDoctor";
import HomeSick from "./home/HomeSick";
import Profile from "./home/Profile";


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/doctors/home" element={<HomeDoctor />} />
        <Route path="/sicks/home" element={<HomeSick />} />
        <Route path="/doctors/proflie" element={<Profile />} />
        <Route path="/sicks/profile" element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default App
