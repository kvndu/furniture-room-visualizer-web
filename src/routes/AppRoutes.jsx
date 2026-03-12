import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import CreateDesign from "../pages/CreateDesign";
import EditDesign from "../pages/EditDesign";
import Portfolio from "../pages/Portfolio";
import NotFound from "../pages/NotFound";
import Preview3D from "../pages/Preview3D";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-design"
        element={
          <ProtectedRoute>
            <CreateDesign />
          </ProtectedRoute>
        }
      />

      <Route
        path="/preview-3d"
        element={
          <ProtectedRoute>
            <Preview3D />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-design/:id"
        element={
          <ProtectedRoute>
            <EditDesign />
          </ProtectedRoute>
        }
      />

      <Route
        path="/portfolio"
        element={
          <ProtectedRoute>
            <Portfolio />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}