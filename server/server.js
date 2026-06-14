import express from "express"; 
import dotenv, { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import {connectDB} from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import complaintRouter from "./routes/complaintRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isDev = process.env.NODE_ENV === 'development';

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// CORS — in dev mode allow all localhost origins
const corsOptions = {
  credentials: true,
  origin: isDev
    ? ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173']
    : process.env.CLIENT_URL,
};
app.use(cors(corsOptions));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/api/auth", userRouter);
app.use("/api/complaint", complaintRouter)



// Dev-mode error handler — sends stack traces to client
if (isDev) {
  app.use((err, req, res, next) => {
    console.error('\x1b[31m[DEV ERROR]\x1b[0m', err.stack);
    res.status(err.status || 500).json({
      message: err.message,
      stack: err.stack,
    });
  });
}

await connectDB();
app.listen(PORT, () => {
  console.log(`\x1b[32m✔ Server running on PORT: ${PORT} [${process.env.NODE_ENV || 'development'} mode]\x1b[0m`);
  if (isDev) {
    console.log(`\x1b[36m  → API:     http://localhost:${PORT}/api`);
    console.log(`  → Client:  http://localhost:5173\x1b[0m`);
  }
});