const path = require("path");
const fs = require("fs");

const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swaggerConfig");
const cors = require("cors");

// CDN CSS
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

require("dotenv").config();

const authRouter = require("./routes/auth");
const taskRouter = require("./routes/task");
const teamRouter = require("./routes/team");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

const MONGO_URI = process.env.DB_CONNECTION_STRING;
const PORT = process.env.PORT || 3000;

app.use(bodyparser.json());

// CORS Prevention Middleware for API
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(cors());

app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://cdnjs.cloudflare.com",
        "https://task-manager-api-wheat.vercel.app", // Your domain
        "https://vercel.live", // Vercel feedback script
        "'unsafe-inline'", // If necessary
        "'unsafe-eval'", // If necessary
      ],
      styleSrc: [
        "'self'",
        "https://cdnjs.cloudflare.com",
        "'unsafe-inline'",
      ],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "https://task-manager-api-wheat.vercel.app"],
      objectSrc: ["'none'"],
      frameSrc: [
        "'self'",
        "https://vercel.live", // Allow frames from vercel.live
      ],
      upgradeInsecureRequests: [],
    },
  })
);


app.use(compression());

// Swagger Docs
// app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec, {customCee_url: CSS_URL}));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/task", taskRouter);
app.use("/api/team", teamRouter);

//Intro Page Render
app.use("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose.connect(MONGO_URI).then(() => {
  if (process.env.NODE_ENV !== "production") {
    console.log("</> - Connected to Database - </>");
  }

  app.listen(PORT, () => {
    if (process.env.NODE_ENV !== "production") {
      console.log("</> - Started Server - </>");
      console.log(`</> - Link: http://localhost:${PORT} - </>`);
    }
  });
});
