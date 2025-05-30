// src/components/LogoutButton.jsx

import React from "react";
import { useAuthStore } from "../store/useAuthStore";

const LogoutButton = ({ children }) => {
  const { logout } = useAuthStore();

  const onLogout = async () => {
    await logout();
  };

  return (
    <button className="flex items-center gap-2" onClick={onLogout}>
      {children}
    </button>
  );
};

export default LogoutButton;
