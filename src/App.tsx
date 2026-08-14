import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Survey } from "./pages/Survey";
import { Dashboard } from "./pages/Dashboard";
import { useSession } from "./hooks/useSession";

function App() {
  const { session, login, completeSurvey, logout } = useSession();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            session.loggedIn ? (
              <Navigate to={session.surveyComplete ? "/dashboard" : "/survey"} replace />
            ) : (
              <Login onLogin={login} />
            )
          }
        />

        <Route
          path="/survey"
          element={
            !session.loggedIn ? (
              <Navigate to="/login" replace />
            ) : session.surveyComplete ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Survey name={session.name} onComplete={completeSurvey} />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            !session.loggedIn ? (
              <Navigate to="/login" replace />
            ) : !session.surveyComplete ? (
              <Navigate to="/survey" replace />
            ) : (
              <Dashboard session={session} onLogout={logout} />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
