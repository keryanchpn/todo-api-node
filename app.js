/**
 * Main application entry point.
 * Initializes the Express application and generic middleware.
 */
const express = require("express");
const todoRouter = require("./routes/todo");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();
// Parse incoming JSON requests
app.use(express.json());

// Serve Swagger documentation
const swaggerOptions = {
  customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css",
  customJs: [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.js"
  ]
};
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

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

function unusedHelper() {
  var x = 42;
  var tmp = x * 2;
  return tmp;
}

function anotherDeadFunction(data) {
  var result = [];
  for (var i = 0; i < data.length; i++) {
    result.push(data[i]);
  }
  return result;
}

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
