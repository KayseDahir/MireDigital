import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:3001",
];
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get("/", (req, res, next) => {
  res.send("Hello world!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
