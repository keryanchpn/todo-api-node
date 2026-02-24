const request = require("supertest");
const app = require("../app");

beforeEach(async () => {
  const { getDb } = require("../database/database");
  const db = await getDb();
  db.run("DELETE FROM todos");
});

describe("GET /health", () => {
  test("retourne 200 avec status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});

describe("GET /", () => {
  test("retourne 200 avec un message de bienvenue", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
  });
});

describe("POST /todos", () => {
  test("crée un todo avec un titre", async () => {
    const res = await request(app)
      .post("/todos")
      .send({ title: "Mon premier todo" });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Mon premier todo");
    expect(res.body.status).toBe("pending");
    expect(res.body.id).toBeDefined();
  });

  test("crée un todo avec tous les champs", async () => {
    const res = await request(app)
      .post("/todos")
      .send({ title: "Tâche complète", description: "Une description", status: "done" });
    expect(res.status).toBe(201);
    expect(res.body.description).toBe("Une description");
    expect(res.body.status).toBe("done");
  });

  test("retourne 422 si le titre est absent", async () => {
    const res = await request(app).post("/todos").send({});
    expect(res.status).toBe(422);
    expect(res.body.detail).toBe("title is required");
  });
});

describe("GET /todos", () => {
  test("retourne un tableau vide sans todos", async () => {
    const res = await request(app).get("/todos");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test("retourne la liste des todos", async () => {
    await request(app).post("/todos").send({ title: "Todo 1" });
    await request(app).post("/todos").send({ title: "Todo 2" });
    const res = await request(app).get("/todos");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  test("supporte la pagination skip et limit", async () => {
    await request(app).post("/todos").send({ title: "Todo A" });
    await request(app).post("/todos").send({ title: "Todo B" });
    await request(app).post("/todos").send({ title: "Todo C" });
    const res = await request(app).get("/todos?skip=1&limit=1");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });
});

describe("GET /todos/:id", () => {
  test("retourne un todo existant", async () => {
    const created = await request(app).post("/todos").send({ title: "Retrouve-moi" });
    const res = await request(app).get(`/todos/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Retrouve-moi");
  });

  test("retourne 404 pour un id inexistant", async () => {
    const res = await request(app).get("/todos/9999");
    expect(res.status).toBe(404);
    expect(res.body.detail).toBe("Todo not found");
  });
});

describe("PUT /todos/:id", () => {
  test("met à jour un todo existant", async () => {
    const created = await request(app).post("/todos").send({ title: "Original" });
    const res = await request(app)
      .put(`/todos/${created.body.id}`)
      .send({ title: "Mis à jour", status: "done" });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Mis à jour");
    expect(res.body.status).toBe("done");
  });

  test("retourne 404 pour un id inexistant", async () => {
    const res = await request(app).put("/todos/9999").send({ title: "X" });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /todos/:id", () => {
  test("supprime un todo existant", async () => {
    const created = await request(app).post("/todos").send({ title: "Supprime-moi" });
    const res = await request(app).delete(`/todos/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.detail).toBe("Todo deleted");
  });

  test("retourne 404 pour un id inexistant", async () => {
    const res = await request(app).delete("/todos/9999");
    expect(res.status).toBe(404);
  });
});
