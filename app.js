/**
 * Main application entry point.
 * Initializes the Express application and generic middleware.
 */
const Sentry = require("@sentry/node");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require('./swagger.json');
const todoRouter = require("./routes/todo");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || "development",
  tracesSampleRate: 1.0,
});

const app = express();
// Parse incoming JSON requests
app.use(express.json());

const swaggerUiOptions = {
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.js'
  ]
};

// API Documentation Endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerUiOptions));

// Root endpoint to verify API is running
app.get("/", (_req, res) => {
  console.log("someone hit the root endpoint")
  res.json({ message: "Welcome to the Enhanced Express Todo App!" });
});

// Mount the todo router on the /todos path
app.use("/todos", todoRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

Sentry.setupExpressErrorHandler(app);

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
