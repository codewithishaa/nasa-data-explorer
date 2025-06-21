import React, { useEffect, useState, memo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  PointElement,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(BarElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const NeoChart = ({ date }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchNEO = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/neo?start_date=${date}`);
        const data = await res.json();
        const neoList = data.near_earth_objects[date];

        const labels = neoList.map(n => n.name);
        const velocities = neoList.map(n =>
          parseFloat(n.close_approach_data[0].relative_velocity.kilometers_per_hour)
        );

        setChartData({
          labels,
          datasets: [
            {
              label: "Velocity (km/h)",
              data: velocities,
              backgroundColor: "#00BFFF",  // 
              borderRadius: 6,
            }
          ]
        });
      } catch (err) {
        console.error("Neo Chart fetch error", err);
      }
    };

    if (date) fetchNEO();
  }, [date]);

  return (
    <div className="chart-wrapper">
      <h2>🚀 Near-Earth Object Velocity Chart</h2>
      {chartData ? (
        <Bar data={chartData} />
      ) : (
        <p>Loading velocity data...</p>
      )}
    </div>
  );
};

// ✅ Memoized to prevent unnecessary re-renders
export default memo(NeoChart);
