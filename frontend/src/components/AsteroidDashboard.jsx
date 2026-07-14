import React, { useEffect, useState } from "react";
import { fetchNEO } from "../services/nasaApi";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import MetricCard from "./common/MetricCard";
import ChartCard from "./common/ChartCard";
import LoadingSkeleton from "./common/LoadingSkeleton";
import ErrorState from "./common/ErrorState";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const AsteroidDashboard = ({ date, refreshKey }) => {
  const [neos, setNeos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchNEOData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchNEO(date);
      const neoList = data.near_earth_objects?.[date] || [];
      setNeos(neoList);
    } catch (err) {
      console.error("❌ Asteroids fetch error:", err.message);
      setError("Failed to compile NEO data for the specified date.");
      setNeos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (date) {
      fetchNEOData();
    }
  }, [date, refreshKey]);

  if (loading) {
    return (
      <div style={{ marginTop: "2rem" }}>
        <LoadingSkeleton type="metric" count={5} message="Receiving Deep Space Data..." />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1.5rem" }}>
          <LoadingSkeleton type="text" count={2} />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchNEOData} />;
  }

  if (neos.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📡</div>
        <h3>No Near-Earth Objects Detected</h3>
        <p>No orbital approaches recorded on this date. Modify tracking parameters or date.</p>
      </div>
    );
  }

  // Calculate Metrics
  const totalNEOs = neos.length;
  const hazardousCount = neos.filter(n => n.is_potentially_hazardous_asteroid).length;

  let fastestObj = { name: "N/A", speed: 0 };
  let closestObj = { name: "N/A", distance: Infinity };
  let largestObj = { name: "N/A", diameter: 0 };

  neos.forEach((n) => {
    const speed = parseFloat(n.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour || 0);
    if (speed > fastestObj.speed) {
      fastestObj = { name: n.name, speed };
    }

    const distance = parseFloat(n.close_approach_data?.[0]?.miss_distance?.kilometers || Infinity);
    if (distance < closestObj.distance) {
      closestObj = { name: n.name, distance };
    }

    const maxDia = parseFloat(n.estimated_diameter?.kilometers?.estimated_diameter_max || 0);
    if (maxDia > largestObj.diameter) {
      largestObj = { name: n.name, diameter: maxDia };
    }
  });

  const formattedFastest = fastestObj.speed > 0 
    ? `${Math.round(fastestObj.speed).toLocaleString()} km/h` 
    : "N/A";
  
  const formattedClosest = closestObj.distance < Infinity 
    ? `${Math.round(closestObj.distance / 1000).toLocaleString()}k km` 
    : "N/A";

  const formattedLargest = largestObj.diameter > 0 
    ? largestObj.diameter >= 1
      ? `${largestObj.diameter.toFixed(2)} km`
      : `${(largestObj.diameter * 1000).toFixed(0)} m`
    : "N/A";

  // Chart 1: Velocity Bar Chart
  const velocityChartData = {
    labels: neos.map(n => n.name),
    datasets: [
      {
        label: "Velocity (km/h)",
        data: neos.map(n => parseFloat(n.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour || 0)),
        backgroundColor: "rgba(99, 102, 241, 0.75)",
        borderColor: "#6366f1",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Chart 2: Hazard Pie Chart
  const hazardChartData = {
    labels: ["Hazardous", "Non-Hazardous"],
    datasets: [
      {
        data: [hazardousCount, totalNEOs - hazardousCount],
        backgroundColor: ["#ef4444", "#10b981"],
        borderColor: "rgba(3, 3, 4, 0.4)",
        borderWidth: 2,
      },
    ],
  };

  // Chart 3: Size Bar Chart
  const smallCount = neos.filter(n => n.estimated_diameter?.kilometers?.estimated_diameter_max < 0.5).length;
  const mediumCount = neos.filter(n => {
    const d = n.estimated_diameter?.kilometers?.estimated_diameter_max;
    return d >= 0.5 && d < 1.5;
  }).length;
  const largeCount = neos.filter(n => n.estimated_diameter?.kilometers?.estimated_diameter_max >= 1.5).length;

  const sizeChartData = {
    labels: ["Small (<0.5km)", "Medium (0.5-1.5km)", "Large (>=1.5km)"],
    datasets: [
      {
        label: "Asteroids Count",
        data: [smallCount, mediumCount, largeCount],
        backgroundColor: ["#3b82f6", "#f59e0b", "#ef4444"],
        borderColor: "rgba(255, 255, 255, 0.05)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Chart 4: Approach Speed Line Chart
  const speedChartData = {
    labels: neos.map(n => n.name),
    datasets: [
      {
        label: "Approach Speed (km/s)",
        data: neos.map(n => parseFloat(n.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second || 0)),
        borderColor: "#ec4899",
        backgroundColor: "rgba(236, 72, 153, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointBackgroundColor: "#ec4899",
        pointBorderColor: "#fff",
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "rgba(255, 255, 255, 0.7)",
          font: { family: "Outfit", size: 11 },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "rgba(255, 255, 255, 0.5)", font: { family: "Outfit", size: 10 } },
      },
      y: {
        grid: { color: "rgba(255, 255, 255, 0.05)", borderDash: [5, 5] },
        ticks: { color: "rgba(255, 255, 255, 0.5)", font: { family: "Outfit", size: 10 } },
      },
    },
  };

  return (
    <div style={{ marginTop: "1.5rem" }}>
      {/* Metrics Row */}
      <div className="stat-grid">
        <MetricCard title="Total Orbiting Objects" value={totalNEOs} icon="☄️" color="#6366f1" subtext="Count of flybys today" />
        <MetricCard title="Potentially Hazardous" value={hazardousCount} icon="☣️" color="#ef4444" subtext="Requires orbit monitoring" />
        <MetricCard title="Fastest Flyby Speed" value={formattedFastest} icon="⚡" color="#ec4899" subtext={`Name: ${fastestObj.name}`} />
        <MetricCard title="Closest Approach" value={formattedClosest} icon="🌍" color="#10b981" subtext={`Name: ${closestObj.name}`} />
        <MetricCard title="Largest Diameter" value={formattedLargest} icon="📏" color="#f59e0b" subtext={`Name: ${largestObj.name}`} />
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <ChartCard title="Near-Earth Object Velocity" description="Relative velocity in kilometers per hour for each asteroid.">
          <Bar data={velocityChartData} options={chartOptions} />
        </ChartCard>
        <ChartCard title="Hazard Classification" description="Ratio of safe to potentially hazardous asteroids in orbit.">
          <Pie 
            data={hazardChartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: { color: "rgba(255, 255, 255, 0.7)", font: { family: "Outfit", size: 11 } }
                }
              }
            }} 
          />
        </ChartCard>
        <ChartCard title="Estimated Diameter Distribution" description="Asteroid counts categorized by max estimated size.">
          <Bar data={sizeChartData} options={chartOptions} />
        </ChartCard>
        <ChartCard title="Approach Speed Trend" description="Plot of travel speed in kilometers per second across celestial items.">
          <Line data={speedChartData} options={chartOptions} />
        </ChartCard>
      </div>

      {/* Data Table */}
      <div style={styles.tableHeader}>
        <h3 style={{ color: "#fff", fontWeight: "600", fontSize: "1.1rem" }}>Asteroid Telemetry Registry</h3>
        <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.8rem", margin: "4px 0 0 0" }}>Detailed tracking database for detected orbiting objects</p>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Object Name</th>
              <th>Velocity</th>
              <th>Approach Speed</th>
              <th>Miss Distance</th>
              <th>Max Diameter</th>
              <th>Hazard Status</th>
            </tr>
          </thead>
          <tbody>
            {neos.map((n, idx) => {
              const speedH = parseFloat(n.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour || 0);
              const speedS = parseFloat(n.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second || 0);
              const distance = parseFloat(n.close_approach_data?.[0]?.miss_distance?.kilometers || 0);
              const maxDia = parseFloat(n.estimated_diameter?.kilometers?.estimated_diameter_max || 0);
              const isHazardous = n.is_potentially_hazardous_asteroid;
              
              // Custom monitor label: if miss distance is < 7,500,000 km
              let statusBadge = <span className="badge-safe">Safe</span>;
              if (isHazardous) {
                statusBadge = <span className="badge-hazardous">Hazardous</span>;
              } else if (distance < 7500000) {
                statusBadge = <span className="badge-monitor">Monitor</span>;
              }

              return (
                <tr key={idx}>
                  <td style={{ fontWeight: "600", color: "#fff" }}>{n.name}</td>
                  <td>{Math.round(speedH).toLocaleString()} km/h</td>
                  <td>{speedS.toFixed(2)} km/s</td>
                  <td>{(distance / 1000000).toFixed(2)}M km</td>
                  <td>
                    {maxDia >= 1 
                      ? `${maxDia.toFixed(2)} km` 
                      : `${Math.round(maxDia * 1000)} m`}
                  </td>
                  <td>{statusBadge}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  emptyContainer: {
    padding: "3rem 1.5rem",
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px dashed rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    textAlign: "center",
    marginTop: "1.5rem",
  },
  tableHeader: {
    marginTop: "2.5rem",
    display: "flex",
    flexDirection: "column",
  },
  cardHeader: {
    marginTop: "2.5rem",
    display: "flex",
    flexDirection: "column",
  },
  asteroidGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.5rem",
    marginTop: "1.5rem",
  },
  asteroidCard: {
    padding: "1.25rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  asteroidCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    paddingBottom: "0.5rem",
  },
  asteroidName: {
    fontSize: "0.95rem",
    color: "#fff",
    fontWeight: "700",
    margin: "0",
  },
  asteroidCardBody: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  asteroidMetric: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.8rem",
  },
  metricLabel: {
    color: "rgba(255, 255, 255, 0.4)",
  },
  metricValue: {
    color: "#fff",
    fontWeight: "600",
  },
};

export default AsteroidDashboard;
