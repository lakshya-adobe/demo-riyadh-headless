/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./utils/scrollToTop";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import DestinationDetail from "./components/DestinationDetail";
import "./App.scss";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="site-shell">
        <Header />
        <main className="App">
          <Routes>
            <Route path='/destination/:name' element={<DestinationDetail />}/>
            <Route path="/" element={<Home/>}/>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
