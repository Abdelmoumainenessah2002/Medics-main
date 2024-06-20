import React from "react"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./Header-Footer/Header"
import Index from "./portfolio/Index"
import Login from "./Authentication/Login";
import Register from "./Authentication/Register";
import Forgot from "./Authentication/Forgot";
import HomeDoctor from "./home/doctor/HomeDoctor";
import HomeSick from "./home/sick/HomeSick";
import DoctorProfile from "./home/doctor/DoctorProfile";
import SickProfile from "./home/sick/SickProfile";
import VisitDoctorProfile from "./home/sick/VisitDoctorProfile";
import Articles from "./home/doctor/Articles";


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
        <Route path="/doctors/home/profile" element={<DoctorProfile />} />
        <Route path="/sicks/home/profile" element={<SickProfile />} />
        <Route path="/sicks/home" element={<HomeSick />} />
        <Route path="/sicks/home/visit-doctor-profile/:uid" element={<VisitDoctorProfile />} />
        <Route path="/doctors/home/articles" element={<Articles />} />
      </Routes>
    </Router>
  )
}

export default App
