# MindfuLearn 

An intelligent, next-generation Learning Management System powered by Google's Gemini AI, featuring a dynamic UI and personalized learning tools. This project was developed for the Synapse2k25 competition.

---

##  Hosting Link (Live Demo)

* **Frontend (Vercel):** `https://mindful-learn.vercel.app/`
* **Backend (Render):** `https://mindfulearn-backend.onrender.com`

---

## Features Implemented

MindfuLearn goes beyond a traditional LMS by integrating cutting-edge UI and AI-powered features.

#### Core LMS Functionality
* **Role-Based Authentication:** Secure registration and login for both **Students** and **Teachers**.
* **Course Management:** Teachers can create and manage courses with titles, descriptions, and images.
* **Course Enrollment:** Students can browse and enroll in available courses.
* **Assignment & Submission System:** Teachers can create assignments, and students can submit their work with file uploads.
* **Grading System:** Teachers can grade assignments, and students can view their individual and overall course grades.

#### Unique & Advanced Features
* **Next-Generation UI/UX:**
    * Dynamic "Aurora" animated gradient backgrounds with interactive particles.
    * Modern "Glassmorphism" UI with blurred, transparent panels.
    * Interactive 3D hover effects on cards using Framer Motion.
* **AI-Powered by Gemini 2.0:**
    * **AI Course Tutor:** An interactive chatbot for students that answers questions based on uploaded course materials.
    * **Personalized Recommendations:** Students can get AI-generated feedback on their performance.
    * **AI Teacher Tools:** Teachers can get AI-powered performance analysis for individual students and generate lesson plans instantly.
* **Collaborative Tools:**
    * **Discussion Forums:** A dedicated forum for each course where students and teachers can interact.
    * **Course Materials:** Teachers can upload course resources, which are then accessible to students and the AI Tutor.
* **Notification System:**
    * Real-time in-app notifications for new assignments and grades.
    * Email notifications for critical updates like grades.

---

## Tech Stack Used

* **Frontend:** React (Vite), Tailwind CSS, Framer Motion
* **Backend:** Node.js, Express.js
* **Database:** MongoDB with Mongoose
* **AI & Vector DB:** Google Gemini 2.0 Flash, Pinecone
* **File Storage:** Cloudinary Cloud Storage
* **Deployment:** Vercel (Frontend), Render (Backend).

---

##  Team

* **Team Name:** **CODE_MAX**
* **Members:** 1.Bhuwin rag
               2.G.Devi Sri Prasad
               3.Y.B.S.L.V.Bhavana
               4.B.G.S.Sri Bhavya

---

##  Getting Started & Local Setup

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have the following installed on your machine:
* [Node.js](https://nodejs.org/) (which includes npm)
* [Git](https://git-scm.com/)
* A MongoDB database (either locally or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/Bhuwinrag/MindfulLearn.git](https://github.com/Bhuwinrag/MindfulLearn.git)
    ```

2.  **Navigate into the project directory:**
    ```sh
    cd MindfulLearn
    ```

3.  **Setup the Backend:**
    * Navigate to the backend folder:
      ```sh
      cd backend
      ```
    * Install NPM packages:
      ```sh
      npm install
      ```
    * Create a `.env` file in the `backend` folder and add the following variables with your own secret keys:
      ```env
      MONGO_URI=your_mongodb_connection_string
      JWT_SECRET=your_super_secret_jwt_key
      PORT=5000
      
      GEMINI_API_KEY=your_gemini_api_key
      
      PINECONE_API_KEY=your_pinecone_api_key
      
      EMAIL_USER=your_gmail_address@gmail.com
      EMAIL_PASS=your_16_character_gmail_app_password
      ```

4.  **Setup the Frontend:**
    * Navigate to the frontend folder from the root directory:
      ```sh
      cd frontend
      ```
    * Install NPM packages:
      ```sh
      npm install
      ```
    * Create a `.env` file in the `frontend` folder and add the following variable:
      ```env
      VITE_API_URL=http://localhost:5000/api
      ```

### Running the Application

You will need to run the backend and frontend servers in two separate terminals.

1.  **Run the Backend Server:**
    * Open a terminal in the `backend` folder.
    * Run the command:
      ```sh
      npm run server
      ```
    * The server should be running on `http://localhost:5000`.

2.  **Run the Frontend Server:**
    * Open a **new** terminal in the `frontend` folder.
    * Run the command:
      ```sh
      npm run dev
      ```
    * The application should open automatically in your browser at `http://localhost:5173`.
