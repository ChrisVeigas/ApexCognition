ApexCognition
ApexCognition is a high-performance, deterministic UI generation engine. It combines a rule-based deterministic parser with the power of the Groq Llama-3 model to transform natural language prompts into structured, production-ready React components.

🚀 Features
Hybrid Generation Engine: Uses a deterministic logic layer for common UI patterns (Login, Dashboards, Tables) and falls back to Groq AI for complex, custom requests.
Massive Component Library: Built to interface with a comprehensive suite of UI components including Charts, Data Tables, NavMenus, and specialized inputs like OTP.
Deterministic Reliability: Ensures that standard requests like "Login Page" always return optimized, accessible, and consistent layouts.
Express/Node.js Backend: A robust server-side architecture handling API routing and AI orchestration.
Stateful History: Full undo/redo capabilities for generated UI plans using a custom React hook.

🛠️ Tech Stack
Frontend: React, TypeScript, Tailwind CSS, Vite
Backend: Node.js, Express, TSX
AI Orchestration: Groq SDK (Llama-3.3-70b-versatile)
Environment Management: cross-env, dotenv

Clone the repository:
git clone https://github.com/ChrisVeigas/ApexCognition.git
cd ApexCognition

Install dependencies:
npm install

Environment Configuration:
Create a .env file in the root directory and add your Groq API key:
GROQ_API_KEY=your_gsk_key_here
PORT=3001
NODE_ENV=development

Run the Development Server:
npm run dev
The server will start on http://localhost:3001
