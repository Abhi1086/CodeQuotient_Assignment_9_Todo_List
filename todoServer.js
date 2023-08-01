const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/todoViews/index.html");
});

app.post("/todo", function (req, res) {
  saveTodoInFile(req.body, function (err) {
    if (err) {
      res.status(500).send("error");
      return;
    }

    res.status(200).send("success");
  });
});

app.get("/todo-data", function (req, res) {
  readAllTodos(function (err, data) {
    if (err) {
      res.status(500).send("error");
      return;
    }

    res.status(200).json(data);
  });
});

app.put("/todo/:id", function (req, res) {
  readAllTodos(function (err, todos) {
    if (err) {
      res.status(500).send("error");
      return;
    }

    const todoIndex = todos.findIndex(todo => todo.id == req.params.id);
    if (todoIndex === -1) {
      res.status(404).send("Todo not found");
      return;
    }

    todos[todoIndex].completed = req.body.completed;
    writeTodosToFile(todos, function (err) {
      if (err) {
        res.status(500).send("error");
        return;
      }
      res.status(200).send("success");
    });
  });
});

app.delete("/todo/:id", function (req, res) {
  readAllTodos(function (err, todos) {
    if (err) {
      res.status(500).send("error");
      return;
    }

    const todoIndex = todos.findIndex(todo => todo.id == req.params.id);
    if (todoIndex === -1) {
      res.status(404).send("Todo not found");
      return;
    }

    todos.splice(todoIndex, 1);
    writeTodosToFile(todos, function (err) {
      if (err) {
        res.status(500).send("error");
        return;
      }
      res.status(200).send("success");
    });
  });
});

app.get("/about", function (req, res) {
  res.sendFile(__dirname + "/todoViews/about.html");
});

app.get("/contact", function (req, res) {
  res.sendFile(__dirname + "/todoViews/contact.html");
});

app.get("/todo", function (req, res) {
  res.sendFile(__dirname + "/todoViews/todo.html");
});

app.get("/todoScript.js", function (req, res) {
  res.sendFile(__dirname + "/todoViews/scripts/todoScript.js");
});

app.listen(3000, function () {
  console.log("server on port 3000");
});

function readAllTodos(callback) {
  fs.readFile("./todos.json", "utf-8", function (err, data) {
    if (err) {
      callback(err);
      return;
    }

    if (data.length === 0) {
      data = "[]";
    }

    try {
      data = JSON.parse(data);
      callback(null, data);
    } catch (err) {
      callback(err);
    }
  });
}

function writeTodosToFile(todos, callback) {
  fs.writeFile("./todos.json", JSON.stringify(todos), function (err) {
    if (err) {
      callback(err);
      return;
    }
    callback(null);
  });
}

function saveTodoInFile(todo, callback) {
  readAllTodos(function (err, todos) {
    if (err) {
      callback(err);
      return;
    }

    todos.push(todo);
    writeTodosToFile(todos, callback);
  });
}
