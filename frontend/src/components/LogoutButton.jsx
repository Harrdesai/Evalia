// src/components/LogoutButton.jsx

import React from "react";
import { useAuthStore } from "../store/useAuthStore";

const LogoutButton = ({ children }) => {
  const { logout } = useAuthStore();

  // on logout navigate to login
  const onLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <button className="flex items-center gap-2" onClick={onLogout}>
      {children}
    </button>
  );
};

export default LogoutButton;
