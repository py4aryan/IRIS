import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Survey } from "./pages/Survey";
import { Dashboard } from "./pages/Dashboard";
import { IrisMark } from "./components/IrisMark";
import { TechyBackground } from "./components/TechyBackground";
import { useSession } from "./hooks/useSession";

function App() {
  const { session, loading, signup, signIn, completeSurvey, logout } = useSession();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-slate-400 relative">
        <TechyBackground />
        <IrisMark size={72} />
        <p className="text-xs tracking-widest">CONNECTING…</p>
      </div>
    );
  }

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
              <Login onSignup={signup} onSignIn={signIn} />
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
