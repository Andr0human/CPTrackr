import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components";
import { ThemeProvider } from "./contexts";
import { BookmarkedContests, Dashboard } from "./pages";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/bookmarks" element={<BookmarkedContests />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
