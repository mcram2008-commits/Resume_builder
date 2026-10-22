# Smart Resume Builder

Full-stack resume builder using React + Vite + Tailwind, Node.js + Express, MongoDB, JWT authentication, Gemini AI suggestions (optional), and browser Print / Save as PDF.

## Requirements
- Node.js 20+
- MongoDB local instance or MongoDB Atlas connection string
- Optional Gemini API key from https://aistudio.google.com/apikey

## Run locally
1. Extract the ZIP and open the `smart-resume-builder` folder in VS Code.
2. Start MongoDB locally, or create an Atlas database.
3. Backend:
   ```bash
   cd server
   copy .env.example .env
   npm install
   ```
   Edit `.env` and set `MONGODB_URI`, `JWT_SECRET`, and optionally `GEMINI_API_KEY`.
   ```bash
   npm run dev
   ```
4. Frontend in another terminal:
   ```bash
   cd client
   npm install
   npm run dev
   ```
5. Open the Vite URL shown in the terminal (normally http://localhost:5173). Register a new account.

## AI feature and free-tier limits
The AI endpoint uses Google's Gemini API when `GEMINI_API_KEY` is configured. Google may offer a free tier, but eligibility, model availability, rate limits and quotas can change by region/account. Check the current AI Studio/API terms. Without a key, the app returns useful rule-based suggestions so the feature can still be demonstrated. Never put API keys in the client `.env` or commit secrets.

## PDF export
Click **Download / Print PDF** in the preview. In the print dialog choose **Save as PDF**. The print stylesheet hides app controls and formats the resume for paper. Browser print is used to avoid a paid PDF service.

## Security notes
- Passwords are hashed with bcrypt.
- JWT secret must be changed from the example.
- Resume endpoints are scoped to the authenticated user.
- Add HTTPS, stricter production CORS, email verification, password reset and request monitoring before public production deployment.
