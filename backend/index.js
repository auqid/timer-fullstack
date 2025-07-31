const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
app.use(express.json());
let tasks = [
  { id: "1", content: "HTML is easy", important: true },
  { id: "2", content: "Browser can execute only JavaScript", important: false },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello</h1>");
});

app.get("/api/tasks", (req, res) => {
  // console.log(res);
  res.json(tasks);
});

app.get("/api/tasks/:id", (req, res) => {
  const id = req.params.id;
  const note = tasks.find((task) => task.id === id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});
app.delete("api/tasks/:id", (req, res) => {
  const id = req.params.id;
  notes = notes.filter((x) => x.id !== id);
  response.status(204).end();
});

app.post("api/tasks", (req, res) => {
  const task = req.body;
  res.json(task);
});
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const unknownEndpoint = (req, res) => {
  response.status(404).send({ error: "Unknown endpoint" });
};
app.use(requestLogger);
app.use(unknownEndpoint);
app.use(cors());
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
