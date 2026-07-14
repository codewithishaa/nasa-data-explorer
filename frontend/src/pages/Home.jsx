import React, { useState, useEffect } from "react";
import ApodViewer from "../components/ApodViewer";
import AsteroidDashboard from "../components/AsteroidDashboard";
import MarsRoverViewer from "../components/MarsRoverViewer";
import EpicViewer from "../components/EpicViewer";
import ImageLibraryViewer from "../components/ImageLibraryViewer";
import VoiceSearch from "../components/VoiceSearch";
import SectionHeader from "../components/common/SectionHeader";

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const Home = ({ theme, toggleTheme }) => {
  const [date, setDate] = useState(getTodayDate());
  const [activeSection, setActiveSection] = useState("home");
  const [notification, setNotification] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [librarySearchQuery, setLibrarySearchQuery] = useState("");

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // navbar offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleVoiceSearch = (spokenText) => {
    setLibrarySearchQuery(spokenText);
    scrollToSection("library");
    showNotification(`Searching archives for "${spokenText}"... 🎙️`);
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification("");
    }, 5000);
  };

  // Section highlighting on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "asteroids", "epic", "library", "mars", "apod", "about"];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {/* Sticky Top Navbar */}
      <nav className="top-navbar">
        <div className="navbar-container">
          <div className="logo-container" onClick={() => scrollToSection("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ filter: "drop-shadow(0 0 8px rgba(99, 102, 241, 0.7))" }}>
              <path d="M4 20V4L16 20V4" stroke="url(#logoGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="16" cy="20" r="3" fill="#818cf8"/>
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fff" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>
            <span className="logo-text" style={{ textShadow: "0 0 12px rgba(129, 140, 248, 0.45)" }}>NASA Data Explorer</span>
          </div>
          <ul className="nav-links">
            <li>
              <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection("home"); }} className={activeSection === "home" ? "active" : ""}>
                Home
              </a>
            </li>
            <li>
              <a href="#asteroids" onClick={(e) => { e.preventDefault(); scrollToSection("asteroids"); }} className={activeSection === "asteroids" ? "active" : ""}>
                NEO Tracker
              </a>
            </li>
            <li>
              <a href="#epic" onClick={(e) => { e.preventDefault(); scrollToSection("epic"); }} className={activeSection === "epic" ? "active" : ""}>
                EPIC Earth
              </a>
            </li>
            <li>
              <a href="#library" onClick={(e) => { e.preventDefault(); scrollToSection("library"); }} className={activeSection === "library" ? "active" : ""}>
                Image Library
              </a>
            </li>
            <li>
              <a href="#mars" onClick={(e) => { e.preventDefault(); scrollToSection("mars"); }} className={activeSection === "mars" ? "active" : ""}>
                Mars Rover
              </a>
            </li>
            <li>
              <a href="#apod" onClick={(e) => { e.preventDefault(); scrollToSection("apod"); }} className={activeSection === "apod" ? "active" : ""}>
                APOD
              </a>
            </li>
            <li>
              <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection("about"); }} className={activeSection === "about" ? "active" : ""}>
                About
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content Container */}
      <div className="container">
        {/* Floating Voice notification */}
        {notification && <div style={styles.notification}>{notification}</div>}

        {/* Hero Section */}
        <header id="home" style={styles.heroSection}>
          <div style={styles.badgeContainer}>
            <span style={styles.heroBadge}>NASA Open Data Intelligence Platform</span>
          </div>
          <h1 style={styles.heroTitle}>NASA Data Explorer</h1>
          <p style={styles.heroSubtitle}>
            Explore NASA’s open space data through asteroid analytics, astronomy imagery, Mars rover
            photos, Earth observations, AI summaries, and voice-powered search.
          </p>

          <div style={styles.ctaContainer}>
            <button onClick={() => scrollToSection("asteroids")} className="btn-primary" style={styles.ctaBtn}>
              Analyze Asteroids
            </button>
            <button onClick={() => scrollToSection("apod")} className="btn-primary" style={{ ...styles.ctaBtn, background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              Explore APOD
            </button>
            <button onClick={() => scrollToSection("library")} className="btn-primary" style={{ ...styles.ctaBtn, background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              Search Archives
            </button>
          </div>

          {/* Stats / Feature chips */}
          <div style={styles.chipsContainer}>
            <div style={styles.chip}>
              <span style={styles.chipIcon}>🔌</span>
              <span>NASA APIs</span>
            </div>
            <div style={styles.chip}>
              <span style={styles.chipIcon}>⚡</span>
              <span>Real-time Data</span>
            </div>
            <div style={styles.chip}>
              <span style={styles.chipIcon}>🧠</span>
              <span>AI Summaries</span>
            </div>
            <div style={styles.chip}>
              <span style={styles.chipIcon}>🎙️</span>
              <VoiceSearch onResult={handleVoiceSearch} label="Voice Search" style={styles.voiceHeroBtn} />
            </div>
          </div>
        </header>

        {/* Global Control Bar */}
        <div className="glass-panel" style={styles.controlBar}>
          <div style={styles.controlInfo}>
            <span style={styles.controlLabel}>Global Observation Date</span>
            <p style={styles.controlHelper}>
              This date is used across APOD, asteroid tracking, Mars rover photos, and EPIC Earth imagery.
            </p>
          </div>
          <div style={styles.controlActions}>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={styles.globalDatePicker}
            />
            <button onClick={() => {
              setRefreshKey(prev => prev + 1);
              showNotification("Refreshing space data... 🔄");
            }} style={styles.refreshBtn}>
              Refresh Data
            </button>
          </div>
        </div>

        {/* Asteroids Dashboard Section */}
        <section id="asteroids">
          <SectionHeader
            title="Near-Earth Object Tracker"
            subtitle="Monitor asteroids approaching Earth using NASA's Near-Earth Object Web Service. Explore their size, velocity, closest approach distance, and potential hazard classification for the selected date."
            badge="NEO Feed"
          />
          <AsteroidDashboard date={date} refreshKey={refreshKey} />
        </section>

        {/* EPIC Earth Section */}
        <section id="epic">
          <SectionHeader
            title="Latest Available Earth Imagery"
            subtitle="View full-disc images of Earth captured by NASA's EPIC (Earth Polychromatic Imaging Camera) aboard the DSCOVR spacecraft, providing a unique deep-space perspective of our planet from the Sun–Earth L1 Lagrange Point."
            badge="EPIC Imagery"
          />
          <EpicViewer date={date} refreshKey={refreshKey} />
        </section>

        {/* Image Library Section */}
        <section id="library">
          <SectionHeader
            title="NASA Image & Video Library"
            subtitle="Search NASA's official multimedia archive containing images, videos, and audio from space missions, planets, galaxies, spacecraft, astronauts, telescopes, and historic discoveries."
            badge="Archival Search"
          />
          <ImageLibraryViewer externalQuery={librarySearchQuery} onExternalQueryProcessed={() => setLibrarySearchQuery("")} />
        </section>

        {/* Mars Rover Section */}
        <section id="mars">
          <SectionHeader
            title="Mars Rover Explorer"
            subtitle="Browse authentic photographs captured by NASA's Curiosity, Opportunity, and Spirit rovers on the surface of Mars. Filter images by rover, camera, and Earth date to explore the Red Planet through NASA's robotic missions."
            badge="Rover Imagery"
          />
          <MarsRoverViewer date={date} refreshKey={refreshKey} />
        </section>

        {/* APOD Section */}
        <section id="apod">
          <SectionHeader
            title="Astronomy Picture of the Day"
            subtitle="Discover NASA's featured astronomy image or video of the day, accompanied by an official scientific explanation and an AI-generated summary for a clearer understanding of the featured observation."
            badge="APOD Registry"
          />
          <ApodViewer date={date} refreshKey={refreshKey} />
        </section>

        {/* Project Overview & Engineering Highlights Section */}
        <section id="about" className="glass-panel" style={styles.overviewSection}>
          <div style={styles.overviewHeader}>
            <span style={styles.overviewBadge}>Portfolio Showcase</span>
            <h2 style={styles.overviewTitle}>Project Overview & Engineering Highlights</h2>
            <div style={styles.overviewDivider}></div>
          </div>

          <div className="overview-grid">
            {/* Column 1: Full-Stack Engineering */}
            <div className="overview-card">
              <div style={styles.overviewCardIcon}>⚙️</div>
              <h3 style={styles.overviewCardTitle}>Full-Stack Engineering</h3>
              <p style={styles.overviewCardDesc}>
                Designed and developed as a modern full-stack web application using React and Express.js with a modular architecture, reusable components, and secure backend API communication.
              </p>
              <ul style={styles.overviewBulletList}>
                <li style={styles.overviewBullet}><span style={styles.bulletDot}></span>React 19 Single Page Application</li>
                <li style={styles.overviewBullet}><span style={styles.bulletDot}></span>Express.js REST API Architecture</li>
                <li style={styles.overviewBullet}><span style={styles.bulletDot}></span>Backend API Proxy Layer</li>
                <li style={styles.overviewBullet}><span style={styles.bulletDot}></span>Modular MVC Backend Design</li>
                <li style={styles.overviewBullet}><span style={styles.bulletDot}></span>Axios API Communication</li>
                <li style={styles.overviewBullet}><span style={styles.bulletDot}></span>Responsive Glassmorphism UI</li>
                <li style={styles.overviewBullet}><span style={styles.bulletDot}></span>Reusable React Components</li>
              </ul>
            </div>

            {/* Column 2: AI & Data Processing */}
            <div className="overview-card">
              <div style={styles.overviewCardIcon}>🧠</div>
              <h3 style={styles.overviewCardTitle}>AI & Data Processing</h3>
              <p style={styles.overviewCardDesc}>
                Applies artificial intelligence and real-time data processing techniques to transform NASA telemetry into meaningful visual insights and summaries.
              </p>
              <ul style={styles.overviewBulletList}>
                <li style={styles.overviewBullet}><span style={styles.bulletDot}></span>OpenAI-powered APOD Summaries</li>
                <li style={styles.overviewBullet}><span style={styles.bulletDot}></span>Intelligent Text Processing</li>
                <li style={styles.overviewBullet}><span style={styles.bulletDot}></span>Interactive Data Visualization</li>
                <li style={styles.overviewBullet}><span style={styles.bulletDot}></span>Asteroid Analytics Dashboard</li>
                <li style={styles.overviewBullet}><span style={styles.bulletDot}></span>Real-time NASA Data Processing</li>
                <li style={styles.overviewBullet}><span style={styles.bulletDot}></span>Voice Search Integration</li>
                <li style={styles.overviewBullet}><span style={styles.bulletDot}></span>Structured JSON Transformation</li>
              </ul>
            </div>

            {/* Column 3: NASA APIs Integrated */}
            <div className="overview-card">
              <div style={styles.overviewCardIcon}>🚀</div>
              <h3 style={styles.overviewCardTitle}>NASA APIs Integrated</h3>
              <p style={styles.overviewCardDesc}>
                Integrates multiple official NASA Open APIs through a secure Express backend instead of exposing API keys directly to the client.
              </p>
              <ul style={styles.overviewBulletList}>
                <li style={styles.overviewBullet}><span style={styles.bulletDot}></span>APOD — Astronomy Picture of the Day</li>
                <li style={styles.overviewBullet}><span style={styles.bulletDot}></span>NeoWs — Near Earth Object Web Service</li>
                <li style={styles.overviewBullet}><span style={styles.bulletDot}></span>Mars Rover Photos API</li>
                <li style={styles.overviewBullet}><span style={styles.bulletDot}></span>EPIC Earth Observation API</li>
                <li style={styles.overviewBullet}><span style={styles.bulletDot}></span>NASA Image & Video Library API</li>
                <li style={styles.overviewBullet}><span style={styles.bulletDot}></span>Secure Backend API Integration</li>
                <li style={styles.overviewBullet}><span style={styles.bulletDot}></span>Live Space Data Retrieval</li>
              </ul>
            </div>

            {/* Column 4: Software Engineering Practices */}
            <div className="overview-card">
              <div style={styles.overviewCardIcon}>🏗️</div>
              <h3 style={styles.overviewCardTitle}>Software Engineering Practices</h3>
              <p style={styles.overviewCardDesc}>
                Built following software engineering best practices with reusable architecture, robust API handling, and production-ready frontend development.
              </p>
              <ul style={styles.overviewBulletList}>
                <li style={styles.overviewBullet}><span style={styles.bulletDot}></span>RESTful Backend Architecture</li>
                <li style={styles.overviewBullet}><span style={styles.bulletDot}></span>Reusable Component Design</li>
                <li style={styles.overviewBullet}><span style={styles.bulletDot}></span>API Error Handling</li>
                <li style={styles.overviewBullet}><span style={styles.bulletDot}></span>Loading Skeletons</li>
                <li style={styles.overviewBullet}><span style={styles.bulletDot}></span>Responsive Mobile-first Design</li>
                <li style={styles.overviewBullet}><span style={styles.bulletDot}></span>Environment Variable Management</li>
                <li style={styles.overviewBullet}><span style={styles.bulletDot}></span>Clean Modular Codebase</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Detailed Footer Section */}
        <footer className="glass-panel" style={styles.detailedFooter}>
          <div className="detailed-footer-grid">
            {/* Left Column: Project Info */}
            <div style={styles.footerInfoCol}>
              <h3 style={styles.footerBrand}>NASA Data Explorer</h3>
              <p style={styles.footerDescText}>
                An end-to-end full-stack web application integrating multiple NASA Open APIs to deliver real-time space exploration, AI-generated insights, asteroid analytics, Earth observations, Mars rover imagery, and intelligent image search through an interactive dashboard.
              </p>
              <div style={styles.footerCreator}>
                <span style={styles.creatorLabel}>Created by</span>
                <span style={styles.creatorName}>Isha Borgaonkar</span>
              </div>
              <div style={styles.footerSocials}>
                <a href="https://github.com/codewithishaa" target="_blank" rel="noopener noreferrer" className="social-pill">
                  <span>GitHub</span>
                </a>
                <a href="https://ishaborgaonkar.com/" target="_blank" rel="noopener noreferrer" className="social-pill">
                  <span>Portfolio</span>
                </a>
                <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="social-pill">
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Center Column: Technologies */}
            <div style={styles.footerTechCol}>
              <h4 style={styles.footerColTitle}>Technologies</h4>
              <div className="tech-categories-grid">
                <div style={styles.techCategory}>
                  <h5 style={styles.techCategoryTitle}>Frontend</h5>
                  <ul style={styles.techList}>
                    <li>React 19</li>
                    <li>React Router</li>
                    <li>Axios</li>
                    <li>HTML5</li>
                    <li>CSS3</li>
                  </ul>
                </div>
                <div style={styles.techCategory}>
                  <h5 style={styles.techCategoryTitle}>Backend</h5>
                  <ul style={styles.techList}>
                    <li>Node.js</li>
                    <li>Express.js</li>
                    <li>REST APIs</li>
                  </ul>
                </div>
                <div style={styles.techCategory}>
                  <h5 style={styles.techCategoryTitle}>Artificial Intelligence</h5>
                  <ul style={styles.techList}>
                    <li>OpenAI API</li>
                    <li>Natural Language Processing</li>
                    <li>AI Summary Generation</li>
                  </ul>
                </div>
                <div style={styles.techCategory}>
                  <h5 style={styles.techCategoryTitle}>Data Visualization</h5>
                  <ul style={styles.techList}>
                    <li>Chart.js</li>
                    <li>Interactive Analytics</li>
                    <li>Statistical Visualizations</li>
                  </ul>
                </div>
                <div style={styles.techCategory}>
                  <h5 style={styles.techCategoryTitle}>External APIs</h5>
                  <ul style={styles.techList}>
                    <li>NASA APOD API</li>
                    <li>NASA NeoWs API</li>
                    <li>NASA Mars Rover API</li>
                    <li>NASA EPIC API</li>
                    <li>NASA Image & Video Library API</li>
                  </ul>
                </div>
                <div style={styles.techCategory}>
                  <h5 style={styles.techCategoryTitle}>Deployment</h5>
                  <ul style={styles.techList}>
                    <li>Vercel</li>
                    <li>Render</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column: Features */}
            <div style={styles.footerFeaturesCol}>
              <h4 style={styles.footerColTitle}>Features Implemented</h4>
              <ul style={styles.featuresList}>
                <li style={styles.featureItem}><span style={styles.featureCheck}>✓</span>Astronomy Picture of the Day Viewer</li>
                <li style={styles.featureItem}><span style={styles.featureCheck}>✓</span>AI-generated Space Summaries</li>
                <li style={styles.featureItem}><span style={styles.featureCheck}>✓</span>Near Earth Object Analytics Dashboard</li>
                <li style={styles.featureItem}><span style={styles.featureCheck}>✓</span>Interactive Asteroid Charts</li>
                <li style={styles.featureItem}><span style={styles.featureCheck}>✓</span>Mars Rover Image Explorer</li>
                <li style={styles.featureItem}><span style={styles.featureCheck}>✓</span>EPIC Earth Observation Viewer</li>
                <li style={styles.featureItem}><span style={styles.featureCheck}>✓</span>NASA Image & Video Library Search</li>
                <li style={styles.featureItem}><span style={styles.featureCheck}>✓</span>Voice Search using Web Speech API</li>
                <li style={styles.featureItem}><span style={styles.featureCheck}>✓</span>Secure Express.js Backend</li>
                <li style={styles.featureItem}><span style={styles.featureCheck}>✓</span>Real-time NASA API Integration</li>
                <li style={styles.featureItem}><span style={styles.featureCheck}>✓</span>Interactive Image Modal</li>
                <li style={styles.featureItem}><span style={styles.featureCheck}>✓</span>Responsive Mobile-first Design</li>
                <li style={styles.featureItem}><span style={styles.featureCheck}>✓</span>Error Handling & Loading States</li>
              </ul>
            </div>
          </div>
          <div style={styles.footerBottom}>
            <p>© 2026 NASA Data Explorer. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

const styles = {
  heroSection: {
    padding: "4rem 0 2.5rem 0",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "850px",
    margin: "0 auto",
  },
  badgeContainer: {
    marginBottom: "1rem",
  },
  heroBadge: {
    padding: "6px 14px",
    background: "rgba(99, 102, 241, 0.1)",
    border: "1px solid rgba(99, 102, 241, 0.25)",
    borderRadius: "30px",
    color: "#a5b4fc",
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1.2px",
  },
  heroTitle: {
    fontSize: "3.5rem",
    fontWeight: "800",
    margin: "0 0 1rem 0",
    letterSpacing: "-0.03em",
    background: "linear-gradient(135deg, #ffffff 30%, #818cf8 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSubtitle: {
    fontSize: "1.1rem",
    color: "var(--text-secondary)",
    lineHeight: "1.6",
    marginBottom: "2rem",
  },
  ctaContainer: {
    display: "flex",
    gap: "1rem",
    marginBottom: "3rem",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  ctaBtn: {
    padding: "12px 28px",
    fontSize: "0.95rem",
  },
  chipsContainer: {
    display: "flex",
    gap: "1.2rem",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  chip: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "6px 14px",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "20px",
    fontSize: "0.85rem",
    color: "rgba(255, 255, 255, 0.8)",
  },
  chipIcon: {
    fontSize: "1rem",
  },
  voiceHeroBtn: {
    background: "transparent",
    border: "none",
    padding: "0",
    boxShadow: "none",
    height: "auto",
    color: "inherit",
    fontWeight: "inherit",
    fontSize: "inherit",
  },
  notification: {
    position: "fixed",
    bottom: "2rem",
    right: "2rem",
    background: "rgba(99, 102, 241, 0.95)",
    color: "#fff",
    padding: "1rem 1.5rem",
    borderRadius: "10px",
    boxShadow: "0 10px 30px rgba(99, 102, 241, 0.3)",
    zIndex: 9999,
    fontSize: "0.9rem",
    fontWeight: "600",
    animation: "pulse 2s infinite ease-in-out",
  },
  // ── Project Overview & Engineering Highlights ──
  overviewSection: {
    padding: "3rem 2.5rem",
    marginTop: "4rem",
  },
  overviewHeader: {
    textAlign: "center",
    marginBottom: "2.5rem",
  },
  overviewBadge: {
    display: "inline-block",
    padding: "6px 16px",
    background: "rgba(99, 102, 241, 0.1)",
    border: "1px solid rgba(99, 102, 241, 0.25)",
    borderRadius: "30px",
    color: "#a5b4fc",
    fontSize: "0.72rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    marginBottom: "1rem",
  },
  overviewTitle: {
    color: "#fff",
    fontSize: "1.6rem",
    fontWeight: "700",
    marginBottom: "0.75rem",
    letterSpacing: "-0.02em",
    background: "linear-gradient(135deg, #ffffff 30%, #818cf8 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  overviewDivider: {
    width: "60px",
    height: "3px",
    background: "linear-gradient(90deg, #6366f1, #818cf8)",
    borderRadius: "4px",
    margin: "0 auto",
  },
  overviewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1.5rem",
  },
  overviewCard: {
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "14px",
    padding: "1.75rem 1.5rem",
    transition: "border-color 0.3s, transform 0.3s",
  },
  overviewCardIcon: {
    fontSize: "1.75rem",
    marginBottom: "0.85rem",
    filter: "drop-shadow(0 0 8px rgba(99, 102, 241, 0.4))",
  },
  overviewCardTitle: {
    fontSize: "0.95rem",
    fontWeight: "700",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "0.75rem",
  },
  overviewCardDesc: {
    fontSize: "0.82rem",
    color: "rgba(255, 255, 255, 0.55)",
    lineHeight: "1.6",
    marginBottom: "1.25rem",
  },
  overviewBulletList: {
    listStyleType: "none",
    padding: "0",
    margin: "0",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  overviewBullet: {
    fontSize: "0.82rem",
    color: "rgba(255, 255, 255, 0.72)",
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
  },
  bulletDot: {
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    background: "#6366f1",
    flexShrink: "0",
    boxShadow: "0 0 6px rgba(99, 102, 241, 0.5)",
  },

  // ── Detailed Footer ──
  detailedFooter: {
    marginTop: "2.5rem",
    padding: "3rem 2.5rem 2rem 2.5rem",
  },
  detailedFooterGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.4fr 1fr",
    gap: "3rem",
    marginBottom: "2.5rem",
  },
  footerInfoCol: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  footerBrand: {
    fontSize: "1.5rem",
    fontWeight: "700",
    background: "linear-gradient(135deg, #ffffff 30%, #818cf8 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0",
  },
  footerDescText: {
    fontSize: "0.85rem",
    lineHeight: "1.65",
    color: "rgba(255, 255, 255, 0.55)",
    margin: "0",
  },
  footerCreator: {
    display: "flex",
    flexDirection: "column",
    gap: "0.15rem",
    marginTop: "0.75rem",
  },
  creatorLabel: {
    fontSize: "0.75rem",
    color: "rgba(255, 255, 255, 0.4)",
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontWeight: "500",
  },
  creatorName: {
    fontSize: "1rem",
    color: "#fff",
    fontWeight: "700",
  },
  footerSocials: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    marginTop: "0.5rem",
    flexWrap: "wrap",
  },
  socialPill: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 16px",
    background: "rgba(99, 102, 241, 0.08)",
    border: "1px solid rgba(99, 102, 241, 0.2)",
    borderRadius: "20px",
    color: "#a5b4fc",
    fontSize: "0.8rem",
    fontWeight: "600",
    textDecoration: "none",
    transition: "background 0.2s, border-color 0.2s, transform 0.2s",
  },
  footerTechCol: {
    display: "flex",
    flexDirection: "column",
  },
  footerColTitle: {
    fontSize: "1.05rem",
    fontWeight: "700",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    margin: "0 0 1.25rem 0",
    paddingBottom: "0.6rem",
    borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
  },
  techCategoriesGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.25rem 2rem",
  },
  techCategory: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  techCategoryTitle: {
    fontSize: "0.78rem",
    fontWeight: "600",
    color: "#818cf8",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    margin: "0 0 0.25rem 0",
  },
  techList: {
    listStyleType: "none",
    padding: "0",
    margin: "0",
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
    fontSize: "0.82rem",
    color: "rgba(255, 255, 255, 0.6)",
  },
  footerFeaturesCol: {
    display: "flex",
    flexDirection: "column",
  },
  featuresList: {
    listStyleType: "none",
    padding: "0",
    margin: "0",
    display: "flex",
    flexDirection: "column",
    gap: "0.55rem",
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    fontSize: "0.82rem",
    color: "rgba(255, 255, 255, 0.7)",
  },
  featureCheck: {
    color: "#10b981",
    fontWeight: "700",
    fontSize: "0.9rem",
    flexShrink: "0",
  },
  footerBottom: {
    textAlign: "center",
    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
    paddingTop: "1.75rem",
    fontSize: "0.8rem",
    color: "rgba(255, 255, 255, 0.35)",
  },
  controlBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.25rem 2rem",
    marginTop: "2rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
    gap: "1.5rem",
    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
    border: "1px solid rgba(99, 102, 241, 0.15)",
    borderRadius: "16px",
  },
  controlInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    flex: "1 1 300px",
  },
  controlLabel: {
    fontSize: "0.95rem",
    fontWeight: "700",
    color: "#fff",
    letterSpacing: "0.3px",
  },
  controlHelper: {
    fontSize: "0.8rem",
    color: "rgba(255, 255, 255, 0.5)",
    margin: "0",
  },
  controlActions: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },
  globalDatePicker: {
    padding: "10px 16px",
    background: "rgba(255, 255, 255, 0.06)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.95rem",
    fontFamily: "var(--font)",
    width: "180px",
  },
  refreshBtn: {
    padding: "10px 20px",
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    fontSize: "0.9rem",
    fontWeight: "600",
  },
};

export default Home;
