import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const ApproachSpeedChart = ({ date }) => {
  const [speedData, setSpeedData] = useState(null);

  useEffect(() => {
    const fetchSpeed = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/neo?start_date=${date}`);
        const data = await res.json();
        const neos = data.near_earth_objects[date];

        const labels = neos.map(n => n.name);
        const speeds = neos.map(n =>
          parseFloat(n.close_approach_data[0].relative_velocity.kilometers_per_second)
        );

        setSpeedData({
          labels,
          datasets: [
            {
              label: "Approach Speed (km/s)",
              data: speeds,
              fill: false,
              borderColor: "#7e57c2",
              backgroundColor: "#7e57c2",
              tension: 0.3,
              pointRadius: 3
            }
          ]
        });
      } catch (err) {
        console.error("Speed chart error", err);
      }
    };
    if (date) fetchSpeed();
  }, [date]);

  return (
    <div className="chart-wrapper">
      <h2>⚡ Asteroid Approach Speed Chart</h2>
      {speedData ? <Line data={speedData} /> : <p>Loading speed data...</p>}
    </div>
  );
};

export default ApproachSpeedChart;
