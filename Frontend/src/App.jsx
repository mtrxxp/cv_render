import React, { useState } from "react";
import LandingPage from "./Landing";
import AuthPage from "./Auth";
import DashboardPage from "./Dashboard";

export default function App() {
  // Состояние роутинга: 'landing', 'auth', 'dashboard'
  const [currentPage, setCurrentPage] = useState("landing");

  const [userData, setUserData] = useState(null);

  // Функция, вызываемая при успешной авторизации
  const handleAuthSuccess = (payload) => {
    console.log("Authentication successful! User Payload generated:", payload);
    // Перенаправляем пользователя в его личный кабинет
    setCurrentPage("dashboard");
  };

  return (
    <>
      {currentPage === "landing" && <LandingPage onNavigate={setCurrentPage} />}

      {currentPage === "auth" && (
        <AuthPage
          onNavigate={setCurrentPage}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {currentPage === "dashboard" && (
        // Передаем реальные данные пропсом в Дашборд
        <DashboardPage onNavigate={setCurrentPage} userData={userData} />
      )}
    </>
  );
}
