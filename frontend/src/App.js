import React, { useEffect, useState, lazy, Suspense } from "react";
import "./styles/theme.css";

// Lazy load the Home page
const Home = lazy(() => import("./pages/Home"));

function App() {
  const [theme, setTheme] = useState("dark"); // Default to dark space theme
  
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div>
      <Suspense fallback={<p style={{ textAlign: "center", padding: "3rem", color: "#fff" }}>Loading NASA Data Explorer...</p>}>
        <Home theme={theme} toggleTheme={() => setTheme(theme === "light" ? "dark" : "light")} />
      </Suspense>
    </div>
  );
}

export default App;
