/**
 * Main application entry point.
 * Initializes the Express application and generic middleware.
 */
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const todoRouter = require("./routes/todo");

const app = express();
// Parse incoming JSON requests
app.use(express.json());

// Swagger openapi configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Enhanced Express Todo App API',
      version: '1.0.0',
      description: 'A simple Express Todo API',
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
