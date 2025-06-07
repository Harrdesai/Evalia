// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { Loader } from "lucide-react";

import HomePage from "./page/HomePage";
import RegisterPage from "./page/register";
import LoginPage from "./page/login";
import { useAuthStore } from "./store/useAuthStore";
import Layout from "./layout/layout";
import AdminRoute from "./components/AdminRoute";
import ProblemPage from "./page/ProblemPage";
import AddProblem from "./page/AddProblem";
import Profile from "./page/Profile";
import Playlist from "./page/Playlist";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-stone-50">
        <Loader className="size-10animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start bg-stone-50">
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
          />
        </Route>
        <Route
          path="/register"
          element={!authUser ? <RegisterPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />

        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/profile" />}
        />

        <Route
          path="/problem/:id"
          element={authUser ? <ProblemPage /> : <Navigate to={"/login"} />}
        />

        <Route
        path="/playlist/:playlistId"
        element={authUser ? <Playlist /> : <Navigate to={"/login"} />}
      />

        <Route element={<AdminRoute />}>
          <Route
            path="/add-problem"
            element={authUser ? <AddProblem /> : <Navigate to="/" />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
