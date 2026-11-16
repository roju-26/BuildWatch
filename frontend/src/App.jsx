import ReportForm from "./pages/ReportForm";

function App() {
  return (
    <>
      <header className="app-header">
        <h1>🏗️ BuildWatch</h1>
        <p>Report construction debris blocking public spaces</p>
      </header>
      <main className="container">
        <ReportForm />
      </main>
    </>
  );
}

export default App;
