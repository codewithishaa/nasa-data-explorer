//import React and React hooks useEffect and useState.
import React, { useEffect, useState } from 'react';
//import axios to make HTTP requests to your backend.
import axios from 'axios';

//declaration of react component
const ApodViewer = ({ date, setDate, toggleTheme, theme }) => {
  const [apod, setApod] = useState(null);
  const [showTLDR, setShowTLDR] = useState(false);

//fetching APOD
  const fetchAPOD = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/apod?date=${date}`);
      setApod(res.data);
    } catch (err) {
      console.error('Failed to fetch APOD:', err.message);
    }
  };

  //This effect runs every time the date changes
  //It calls fetchAPOD() to load the new image data.
  useEffect(() => {
    if (date) {
      fetchAPOD();
    }
  }, [date]);
//display of UI 
  return (
    <div className="container">
      <h2 style={{ textAlign: "center" }}>📷 NASA Astronomy Picture of the Day</h2>

      <div style={{ display: 'flex', justifyContent: "center", gap: '10px', flexWrap: "wrap" }}>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button onClick={() => setShowTLDR(!showTLDR)}>
          {showTLDR ? 'Hide TL;DR' : 'Show TL;DR'}
        </button>
        <button onClick={toggleTheme}>
          Switch to {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </div>

      {apod && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <h3>{apod.title}</h3>
          <img
            src={apod.url}
            alt={apod.title}
            style={{ maxWidth: '100%', height: '400px', objectFit: 'cover' }}
          />
          {showTLDR && <p>{apod.explanation}</p>}
        </div>
      )}
    </div>
  );
};

export default ApodViewer;
