import React, { useEffect, useState, lazy, Suspense } from "react";
import "./styles/theme.css";

// Lazy load the Home page
const Home = lazy(() => import("./pages/Home"));

function App() {
  const [theme, setTheme] = useState("light"); // 
  
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className="container">
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading app...</p>}>
        <Home theme={theme} toggleTheme={() => setTheme(theme === "light" ? "dark" : "light")} />
      </Suspense>
    </div>
  );
}

export default App;
