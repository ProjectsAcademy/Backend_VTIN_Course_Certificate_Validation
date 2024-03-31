// corsMiddleware.js
const cors = require("cors");

// List of allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://front-vtin-course-cert-validation.netlify.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Check if the request origin is in the list of allowed origins
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;
