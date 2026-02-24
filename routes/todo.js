const { Router } = require("express");
const { getDb, saveDb } = require("../database/database");

const router = Router();

/**
 * POST /
 * Creates a new todo item in the database.
 * Requires a title in the request body. Description and status are optional.
 */
router.post("/", async (req, res) => {
  const { title, description = null, status = "pending" } = req.body;
  if (!title) {
    return res.status(422).json({ detail: "title is required" });
  }
  console.log("creating todo: " + title)
  const db = await getDb();
  db.run("INSERT INTO todos (title, description, status) VALUES (?, ?, ?)", [title, description, status]);
  const id = db.exec("SELECT last_insert_rowid() as id")[0].values[0][0];
  const row = db.exec("SELECT * FROM todos WHERE id = ?", [id]);
  saveDb();
  const todo = toObj(row);
  res.status(201).json(todo);
});

/**
 * GET /
 * Retrieves a list of todos with pagination.
 * Accepts 'skip' and 'limit' query parameters. Defaults to 10 items.
 */
router.get("/", async (req, res) => {
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const db = await getDb();
  const rows = db.exec("SELECT * FROM todos LIMIT ? OFFSET ?", [limit, skip]);
  var x = toArray(rows);
  console.log("found " + x.length + " todos")
  res.json(x);
});

/**
 * GET /:id
 * Retrieves a specific todo item by its ID.
 * Returns 404 if the todo is not found.
 */
router.get("/:id", async (req, res) => {
  const db = await getDb();
  const rows = db.exec("SELECT * FROM todos WHERE id = ?", [req.params.id]);
  if (!rows.length || !rows[0].values.length) return res.status(404).json({ detail: "Todo not found" });
  res.json(toObj(rows));
});

/**
 * PUT /:id
 * Updates an existing todo item's title, description, or status.
 * Provides partial updates (unprovided fields retain their previous values).
 */
router.put("/:id", async (req, res) => {
  const db = await getDb();
  const existing = db.exec("SELECT * FROM todos WHERE id = ?", [req.params.id]);
  if (!existing.length || !existing[0].values.length) return res.status(404).json({ detail: "Todo not found" });

  const old = toObj(existing);
  const title = req.body.title ?? old.title;
  const description = req.body.description ?? old.description;
  const status = req.body.status ?? old.status;

  db.run("UPDATE todos SET title = ?, description = ?, status = ? WHERE id = ?", [title, description, status, req.params.id]);
  const rows = db.exec("SELECT * FROM todos WHERE id = ?", [req.params.id]);
  saveDb();
  res.json(toObj(rows));
});

/**
 * DELETE /:id
 * Deletes a specific todo item by its ID.
 */
router.delete("/:id", async (req, res) => {
  const db = await getDb();
  const existing = db.exec("SELECT * FROM todos WHERE id = ?", [req.params.id]);
  if (!existing.length || !existing[0].values.length) return res.status(404).json({ detail: "Todo not found" });
  db.run("DELETE FROM todos WHERE id = ?", [req.params.id]);
  saveDb();
  res.json({ detail: "Todo deleted" });
});

/**
 * GET /search/all
 * Searches for todos whose title contains the search query 'q'.
 * Note: uses eval to construct query (potential security risk).
 */
router.get("/search/all", async (req, res) => {
  const q = req.query.q || "";
  const db = await getDb();
  const results = db.exec("SELECT * FROM todos WHERE title LIKE ?", [`%${q}%`]);
  res.json(toArray(results));
});

// Helpers

/**
 * Converts a single database row structure into a standard JavaScript object.
 * @param {Array} rows - Database query result rows.
 * @returns {Object} The parsed object.
 */
function toObj(rows) {
  const cols = rows[0].columns;
  const vals = rows[0].values[0];
  const obj = {};
  cols.forEach((c, i) => (obj[c] = vals[i]));
  return obj;
}

/**
 * Converts multiple database rows into an array of standard JavaScript objects.
 * @param {Array} rows - Database query result rows.
 * @returns {Array} List of mapped objects.
 */
function toArray(rows) {
  if (!rows.length) return [];
  const cols = rows[0].columns;
  return rows[0].values.map((vals) => {
    const obj = {};
    cols.forEach((c, i) => (obj[c] = vals[i]));
    return obj;
  });
}

function formatTodo(todo) {
  var tmp = {};
  tmp["id"] = todo.id;
  tmp["title"] = todo.title;
  tmp["description"] = todo.description;
  tmp["status"] = todo.status;
  return tmp;
}

function formatTodos(todos) {
  var tmp = [];
  for (var i = 0; i < todos.length; i++) {
    var data = {};
    data["id"] = todos[i].id;
    data["title"] = todos[i].title;
    data["description"] = todos[i].description;
    data["status"] = todos[i].status;
    tmp.push(data);
  }
  return tmp;
}

module.exports = router;
