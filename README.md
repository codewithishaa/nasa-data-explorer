# 🚀 NASA Data Explorer – Full Stack Project

This is a full-stack web application that I developed for the Software Engineer Coding Challenge. It uses live NASA APIs to let users explore real-time space data through an interactive and visual dashboard.

---

## 🌐 Live Demo

**Deployed App:**  
https://nasa-data-explorer-sigma.vercel.app

**Video Walkthrough:**  
https://youtu.be/C7OVsyTROPM

**GitHub Repository:**  
https://github.com/codewithishaa/nasa-data-explorer

---

## 🎯 What the App Does

NASA Data Explorer allows users to:
- View the Astronomy Picture of the Day (APOD)
- Use voice search to select a date hands-free
- Visualize asteroid data (velocity, size, speed, and hazard level)
- Explore Mars rover photos
- View daily Earth images from NASA's EPIC camera
- Search NASA’s entire image and video library

It’s fully responsive, supports light/dark theme toggle, and is deployed on Vercel and Render.

---

## 🛠️ Technologies Used

| Layer        | Tools & Libraries                         |
|--------------|--------------------------------------------|
| Frontend     | React, Chart.js, Axios, Web Speech API     |
| Backend      | Node.js, Express, Axios, dotenv            |
| Deployment   | Vercel (frontend), Render (backend)        |
| APIs Used    | NASA: APOD, NeoWs, Mars Rover, EPIC, Image Library |

---

## 📦 Project Structure

nasa-data-explorer/
├── frontend/ # React app (Vercel)
│ ├── src/
│ ├── components/
│ └── .env
├── backend/ # Node.js + Express (Render)
│ ├── routes/
│ ├── controllers/
│ └── .env
└── README.md


---

## 🧠 How the App Works (Simple Logic)

1. The user selects a date or speaks it using voice input.
2. The React frontend sends a request to the backend (e.g., `/api/apod?date=...`).
3. The Node.js + Express backend receives the request, calls the appropriate NASA API using Axios, and returns the result.
4. The frontend receives the response and updates the UI — showing images, rendering charts, or displaying galleries.
5. This pattern is followed consistently across all features: APOD, NEO, EPIC, Mars, and Image Search.

---

## 🧑‍💻 Code Structure (High-Level)

### 🔹 Frontend
- `App.js`: Loads theme and main layout
- `Home.jsx`: Controls shared date state and UI flow
- `components/`: Each feature (APOD, charts, Mars, EPIC, etc.) is a separate React component
- `.env`: Holds `REACT_APP_BACKEND_URL`

### 🔸 Backend
- `index.js`: Sets up Express, middleware, and routes
- `routes/`: Defines API routes like `/api/apod`, `/api/neo`, etc.
- `controllers/`: Calls NASA APIs using Axios and returns clean JSON
- `.env`: Stores sensitive keys (NASA_API_KEY, etc.)

---

## ✨ Feature Highlights

- ✅ APOD image by date or voice
- ✅ Voice search using Web Speech API
- ✅ Charts for asteroid speed, size, and hazard
- ✅ Mars rover photo viewer
- ✅ EPIC Earth image gallery
- ✅ NASA image/video search
- ✅ Light/dark mode toggle
- ✅ Mobile responsive design

---

## 🚀 Deployment Details

- **Frontend**: Deployed to [Vercel](https://vercel.com/)  
- **Backend**: Deployed to [Render](https://render.com/)  
- **Environment Variables**:
  - `REACT_APP_BACKEND_URL` (in frontend)
  - `NASA_API_KEY`, `OPENAI_API_KEY` (in backend)

---

## ⚙️ How to Run the Project Locally

### Step 1: Clone the Repository

```bash
git clone https://github.com/codewithishaa/nasa-data-explorer.git
cd nasa-data-explorer

**### Step 2: Setup Backend** 
cd backend
npm install

Create a .env file:
NASA_API_KEY=your_nasa_api_key
OPENAI_API_KEY=your_openai_api_key 

**### Then start the server:**
node index.js

Step 3: Setup Frontend
cd ../frontend
npm install
Create a .env file:
REACT_APP_BACKEND_URL=http://localhost:5000
Then run the frontend:
npm start

**###Testing**
Voice search tested with valid and edge-case dates
Chart rendering with dynamic asteroid datasets
Responsive layout across devices
Error and loading states handled on all API calls

**Author**
Isha Borgaonkar
📧 Email: ishamborgaonkar@gmail.com
🔗 LinkedIn: Isha Borgaonkar
