import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { ReportPage } from "./pages/ReportPage";
import { ReportsPage } from "./pages/ReportsPage";
import { UserProvider, useUser } from "./contexts/UserContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import "./App.css";

const navActiveClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "active" : "";

function AppContent() {
  const { user, isAdmin, logout } = useUser();

  const navLinks = user ? (
    <>
      <li>
        <NavLink to="/report" className={navActiveClass}>
          Report Bug
        </NavLink>
      </li>
      {isAdmin && (
        <li>
          <NavLink to="/reports" className={navActiveClass}>
            Reports List
          </NavLink>
        </li>
      )}
      <li className="user-info">
        <span>Welcome, {user.email}</span>
        {isAdmin && <span className="admin-badge">Admin</span>}
        <button onClick={logout} className="btn btn-secondary btn-sm">
          Logout
        </button>
      </li>
    </>
  ) : (
    <li>
      <NavLink to="/login" className={navActiveClass}>
        Login
      </NavLink>
    </li>
  );

  return (
    <BrowserRouter>
      <div className="app">
        <nav className="nav">
          <div className="nav-brand">🐛 Bug Reporter</div>
          <ul className="nav-links">{navLinks}</ul>
        </nav>

        <main className="main">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/report"
              element={
                <ProtectedRoute>
                  <ReportPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute requireAdmin>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
