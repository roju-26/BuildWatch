import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import ReportForm from "./pages/ReportForm";
import CaseList from "./pages/CaseList";
import CaseDetails from "./pages/CaseDetails";
import AdminDashboard from "./pages/AdminDashboard";
import Hotspots from "./pages/Hotspots";
import DemoBanner from "./components/DemoBanner";

function Page({ children, wide }) {
  return (
    <div className={wide ? "container container-wide" : "container"}>
      {children}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <DemoBanner />
      <nav className="navbar">
        <NavLink to="/" className="brand">
          🏗️ BuildWatch
        </NavLink>
        <div className="nav-links">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/report">Report</NavLink>
          <NavLink to="/cases">Cases</NavLink>
          <NavLink to="/hotspots">Hotspots</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/report"
          element={
            <Page>
              <ReportForm />
            </Page>
          }
        />
        <Route
          path="/cases"
          element={
            <Page>
              <CaseList />
            </Page>
          }
        />
        <Route
          path="/cases/:caseId"
          element={
            <Page>
              <CaseDetails />
            </Page>
          }
        />
        <Route
          path="/hotspots"
          element={
            <Page wide>
              <Hotspots />
            </Page>
          }
        />
        <Route
          path="/admin"
          element={
            <Page wide>
              <AdminDashboard />
            </Page>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
