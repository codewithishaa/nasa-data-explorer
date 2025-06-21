import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const AsteroidSizeChart = ({ date }) => {
  const [sizeData, setSizeData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/neo?start_date=${date}`);
        const data = await res.json();
        const neoList = data.near_earth_objects[date];

        const small = neoList.filter(n => n.estimated_diameter.kilometers.estimated_diameter_max < 0.5).length;
        const medium = neoList.filter(n => {
          const d = n.estimated_diameter.kilometers.estimated_diameter_max;
          return d >= 0.5 && d < 1.5;
        }).length;
        const large = neoList.filter(n => n.estimated_diameter.kilometers.estimated_diameter_max >= 1.5).length;

        setSizeData({
          labels: ["Small", "Medium", "Large"],
          datasets: [
            {
              label: "Asteroid Sizes",
              data: [small, medium, large],
              backgroundColor: ["#64b5f6", "#ffa726", "#ef5350"],
              borderRadius: 6
            }
          ]
        });
      } catch (err) {
        console.error("Size chart fetch error", err);
      }
    };
    if (date) fetchData();
  }, [date]);

  return (
    <div className="chart-wrapper">
      <h2>📏 Asteroid Size Chart</h2>
      {sizeData ? <Bar data={sizeData} /> : <p>Loading size data...</p>}
    </div>
  );
};

export default AsteroidSizeChart;
