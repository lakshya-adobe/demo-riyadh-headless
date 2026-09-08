/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Outlet,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import ScrollToTop from "./utils/scrollToTop";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import DestinationDetail from "./components/DestinationDetail";
import { DEFAULT_LANGUAGE, LANGUAGES, isSupportedLanguage } from "./locale";
import "./App.scss";

function LocalizedApp() {
  const { language } = useParams();
  const supported = isSupportedLanguage(language);

  useEffect(() => {
    if (!supported) {
      return;
    }

    document.documentElement.lang = language;
    document.documentElement.dir = LANGUAGES[language].direction;
  }, [language, supported]);

  if (!supported) {
    return <Navigate to={`/${DEFAULT_LANGUAGE}`} replace />;
  }

  return (
    <div className="site-shell" dir={LANGUAGES[language].direction}>
      <ScrollToTop />
      <Header language={language} />
      <main className="App">
        <Outlet />
      </main>
      <Footer language={language} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={`/${DEFAULT_LANGUAGE}`} replace />} />
        <Route path="/:language" element={<LocalizedApp />}>
          <Route index element={<Home />} />
          <Route path="destination/:name" element={<DestinationDetail />} />
          <Route path="*" element={<Navigate to=".." replace />} />
        </Route>
        <Route path="*" element={<Navigate to={`/${DEFAULT_LANGUAGE}`} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
