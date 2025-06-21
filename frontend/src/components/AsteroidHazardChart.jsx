import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const AsteroidHazardChart = ({ date }) => {
  const [hazardData, setHazardData] = useState(null);

  useEffect(() => {
    const fetchHazards = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/neo?start_date=${date}`);
        const data = await res.json();
        const neos = data.near_earth_objects[date];

        const hazardous = neos.filter(n => n.is_potentially_hazardous_asteroid).length;
        const nonHazardous = neos.length - hazardous;

        setHazardData({
          labels: ["Hazardous", "Non-Hazardous"],
          datasets: [
            {
              data: [hazardous, nonHazardous],
              backgroundColor: ["#e53935", "#66bb6a"]
            }
          ]
        });
      } catch (err) {
        console.error("Hazard chart error", err);
      }
    };
    if (date) fetchHazards();
  }, [date]);

  return (
    <div className="chart-wrapper">
      <h2>☄️ Asteroid Hazard Chart</h2>
      {hazardData ? <Pie data={hazardData} /> : <p>Loading hazard data...</p>}
    </div>
  );
};

export default AsteroidHazardChart;
