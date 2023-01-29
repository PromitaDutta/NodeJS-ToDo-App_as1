const { format } = require("date-fns");
const { isValid } = require("date-fns");
const { isMatch } = require("date-fns");
const { parseISO } = require("date-fns");
const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "todoApplication.db");
const app = express();
app.use(express.json());

let database = null;
const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(3007, () =>
      console.log("Server Running at http://localhost:3007/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

//#region Functions
function CheckStatus_Data(status_data) {
  if (
    status_data == "TO DO" ||
    status_data == "IN PROGRESS" ||
    status_data == "DONE"
  ) {
    return true;
  } else {
    return false;
  }
}

function CheckCategory_Data(category_data) {
  if (
    category_data == "WORK" ||
    category_data == "HOME" ||
    category_data == "LEARNING"
  ) {
    return true;
  } else {
    return false;
  }
}

function CheckPriority_Data(priority_data) {
  if (
    priority_data == "HIGH" ||
    priority_data == "MEDIUM" ||
    priority_data == "LOW"
  ) {
    return true;
  } else {
    return false;
  }
}

function CheckDueDate_Data(DueDate_data) {
  const result = isMatch(DueDate_data, "yyyy-MM-dd");
  if (result == true) {
    return true;
  } else {
    return false;
  }
}
//#endregion

//#region Get API Scenario
/* Scenario For Get API -  Status    */
const hasStatusProperty = (requestQuery) => {
  return requestQuery.status !== undefined;
};

/* Scenario For Get API -  Priority    */
const hasPriorityProperty = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

/* Scenario For Get API -  Priority & Status    */
const hasPriorityAndStatusProperties = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  );
};

/* Scenario For Get API -  Category    */
const hasCategoryProperty = (requestQuery) => {
  return requestQuery.category !== undefined;
};

/* Scenario For Get API -  Category & Status    */
const hasCategoryAndStatusProperty = (requestQuery) => {
  requestQuery.category !== undefined && requestQuery.status !== undefined;
};

/* Scenario For Get API -  Category & priority    */
const hasCategoryAndPriorityProperty = (requestQuery) => {
  requestQuery.category !== undefined && requestQuery.priority !== undefined;
};

/* Scenario For Get API -  Date    */
const hasDateProperty = (requestQuery) => {
  return requestQuery.date !== undefined;
};

//#endregion

//#region GET API 1
app.get("/todos/", async (request, response) => {
  let data = null;
  let getTodosQuery = "";
  const { search_q = "", priority, status, category } = request.query;
  let Status_Res = false;
  let Priority_Res = false;
  let category_Res = false;

  switch (true) {
    case hasStatusProperty(request.query):
      if (CheckStatus_Data(status)) {
        Status_Res = true;
      } else {
        updateColumn = "Status";
        ErrorResult = "Invalid Todo Status";
      }
      getTodosQuery = `
      SELECT
        id as id,
  todo as todo,
  priority as priority,
  status as status,
  category as category,
  due_date as dueDate 
      FROM
        todo 
      WHERE status = '${status}';`;
      if (Status_Res) {
        data = await database.all(getTodosQuery);
        response.send(data);
      } else {
        response.status(400).send(ErrorResult);
      }
      break;

    case hasPriorityProperty(request.query):
      if (CheckPriority_Data(priority)) {
        Priority_Res = true;
      } else {
        updateColumn = "Priority";
        ErrorResult = "Invalid Todo Priority";
      }
      getTodosQuery = `
      SELECT
        id as id,
  todo as todo,
  priority as priority,
  status as status,
  category as category,
  due_date as dueDate 
      FROM
        todo 
      WHERE priority = '${priority}';`;
      if (Priority_Res) {
        data = await database.all(getTodosQuery);
        response.send(data);
      } else {
        response.status(400).send(ErrorResult);
      }
      break;
    case hasPriorityAndStatusProperties(request.query):
      if (CheckPriority_Data(priority)) {
        Priority_Res = true;
      } else {
        updateColumn = "Priority";
        ErrorResult = "Invalid Todo Priority";
      }
      if (CheckStatus_Data(status)) {
        Status_Res = true;
      } else {
        updateColumn = "Status";
        ErrorResult = "Invalid Todo Status";
      }
      getTodosQuery = `
      SELECT
        id as id,
  todo as todo,
  priority as priority,
  status as status,
  category as category,
  due_date as dueDate 
      FROM
        todo 
      WHERE
        priority = '${priority}'
        AND status = '${status}';`;
      if (Status_Res && Priority_Res) {
        data = await database.all(getTodosQuery);
        response.send(data);
      } else {
        response.status(400).send(ErrorResult);
      }
      break;
    case hasCategoryProperty(request.query):
      if (CheckCategory_Data(category)) {
        category_Res = true;
      } else {
        updateColumn = "Category";
        ErrorResult = "Invalid Todo Category";
      }
      getTodosQuery = `
      SELECT
        id as id,
  todo as todo,
  priority as priority,
  status as status,
  category as category,
  due_date as dueDate 
      FROM
        todo 
      WHERE
        category = '${category}';`;
      if (category_Res) {
        data = await database.all(getTodosQuery);
        response.send(data);
      } else {
        response.status(400).send(ErrorResult);
      }
      break;
    case hasCategoryAndStatusProperty(request.query):
      if (CheckCategory_Data(category)) {
        category_Res = true;
      } else {
        updateColumn = "Category";
        ErrorResult = "Invalid Todo Category";
      }
      if (CheckStatus_Data(status)) {
        Status_Res = true;
      } else {
        updateColumn = "Status";
        ErrorResult = "Invalid Todo Status";
      }
      getTodosQuery = `
      SELECT
        id as id,
  todo as todo,
  priority as priority,
  status as status,
  category as category,
  due_date as dueDate 
      FROM
        todo 
      WHERE
        category = '${category}'
        AND status = '${status}';`;
      if (Status_Res && category_Res) {
        data = await database.all(getTodosQuery);
        response.send(data);
      } else {
        response.status(400).send(ErrorResult);
      }
      break;
    case hasCategoryAndPriorityProperty(request.query):
      if (CheckCategory_Data(category)) {
        category_Res = true;
      } else {
        updateColumn = "Category";
        ErrorResult = "Invalid Todo Category";
      }
      if (CheckPriority_Data(priority)) {
        Priority_Res = true;
      } else {
        updateColumn = "Priority";
        ErrorResult = "Invalid Todo Priority";
      }
      getTodosQuery = `
      SELECT
        id as id,
  todo as todo,
  priority as priority,
  status as status,
  category as category,
  due_date as dueDate
      FROM
        todo 
      WHERE
        priority = '${priority}'
        AND category = '${category}';`;
      if (Priority_Res && category_Res) {
        data = await database.all(getTodosQuery);
        response.send(data);
      } else {
        response.status(400).send(ErrorResult);
      }
      break;
    default:
      getTodosQuery = `
      SELECT
        id as id,
  todo as todo,
  priority as priority,
  status as status,
  category as category,
  due_date as dueDate 
      FROM
        todo 
      WHERE
        todo LIKE '%${search_q}%';`;
      data = await database.all(getTodosQuery);
      response.send(data);
  }
});
//#endregion

//#region  API 2
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  let todo = null;
  const getTodoQuery = `
    SELECT
    id as id,
  todo as todo,
  priority as priority,
  status as status,
  category as category,
  due_date as dueDate 
    FROM
      todo
    WHERE
      id = ${todoId};`;
  todo = await database.get(getTodoQuery);
  response.send(todo);
});
//#endregion

//#region  API 3
app.get("/agenda/", async (request, response) => {
  const { date } = request.query;
  let todo = null;
  let getTodoQuery = "";
  let formatted_date = "";
  let isValidDate = false;
  let updateColumn = "";
  let ErrorResult = "";
  let dueDate_Res = false;

  switch (true) {
    case hasDateProperty(request.query):
      if (CheckDueDate_Data(date)) {
        dueDate_Res = true;
        formatted_date = format(new Date(date), "yyyy-MM-dd");
        isValidDate = isValid(parseISO(formatted_date));
      } else {
        updateColumn = "Due Date";
        ErrorResult = "Invalid Due Date";
      }

      if (isValidDate == true && dueDate_Res) {
        getTodoQuery = `
            SELECT
             id as id,
  todo as todo,
  priority as priority,
  status as status,
  category as category,
  due_date as dueDate 
            FROM
            todo
            WHERE
            due_date = '${formatted_date}';`;
        todo = await database.all(getTodoQuery);

        response.send(todo);
      } else {
        response.status(400).send(ErrorResult);
      }
      break;
  }
});
//#endregion

//#region API 4
app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status, category, dueDate } = request.body;
  let postTodoQuery = "";
  let formatted_date = "";
  let isValidDate = false;
  let updateColumn = "";
  let ErrorResult = "";
  let Status_Res = false;
  let Priority_Res = false;
  let category_Res = false;
  let dueDate_Res = false;

  if (CheckStatus_Data(status)) {
    Status_Res = true;
  } else {
    updateColumn = "Status";
    ErrorResult = "Invalid Todo Status";
  }
  if (CheckCategory_Data(category)) {
    category_Res = true;
  } else {
    updateColumn = "Category";
    ErrorResult = "Invalid Todo Category";
  }
  if (CheckDueDate_Data(dueDate)) {
    dueDate_Res = true;
    formatted_date = format(new Date(dueDate), "yyyy-MM-dd");
    isValidDate = isValid(parseISO(formatted_date));
  } else {
    updateColumn = "Due Date";
    ErrorResult = "Invalid Due Date";
  }
  if (CheckPriority_Data(priority)) {
    Priority_Res = true;
  } else {
    updateColumn = "Priority";
    ErrorResult = "Invalid Todo Priority";
  }

  if (
    isValidDate == true &&
    Status_Res &&
    category_Res &&
    dueDate_Res &&
    Priority_Res
  ) {
    postTodoQuery = `
  INSERT INTO
    todo (id, todo, priority, status, category, due_date)
  VALUES
    (${id}, '${todo}', '${priority}', '${status}','${category}','${formatted_date}');`;
    const db_response = await database.run(postTodoQuery);

    response.send("Todo Successfully Added");
  } else {
    response.status(400).send(ErrorResult);
  }
});
//#endregion

//#region API 5
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  let updateColumn = "";
  let ErrorResult = "";
  let Check = "";
  try {
    const requestBody = request.body;
    switch (true) {
      case requestBody.status !== undefined:
        if (CheckStatus_Data(requestBody.status)) {
          Check = "True";
        }
        updateColumn = "Status";
        ErrorResult = "Invalid Todo Status";
        break;
      case requestBody.priority !== undefined:
        if (CheckPriority_Data(requestBody.priority)) {
          Check = "True";
        }
        updateColumn = "Priority";
        ErrorResult = "Invalid Todo Priority";
        break;
      case requestBody.todo !== undefined:
        Check = "True";
        updateColumn = "Todo";
        ErrorResult = "Invalid Todo";
        break;
      case requestBody.category !== undefined:
        if (CheckCategory_Data(requestBody.category)) {
          Check = "True";
        }
        updateColumn = "Category";
        ErrorResult = "Invalid Todo Category";
        break;
      case requestBody.dueDate !== undefined:
        if (CheckDueDate_Data(requestBody.dueDate)) {
          Check = "True";
        }
        updateColumn = "Due Date";
        ErrorResult = "Invalid Due Date";
        break;
    }
    const previousTodoQuery = `
    SELECT
      *
    FROM
      todo
    WHERE 
      id = ${todoId};`;
    const previousTodo = await database.get(previousTodoQuery);

    const {
      todo = previousTodo.todo,
      priority = previousTodo.priority,
      status = previousTodo.status,
      category = previousTodo.category,
      dueDate = previousTodo.dueDate,
    } = request.body;

    if (Check == "True") {
      const updateTodoQuery = `
    UPDATE
      todo
    SET
      todo='${todo}',
      priority='${priority}',
      status='${status}',
      category='${category}',
      due_date='${dueDate}'
    WHERE
      id = ${todoId};`;

      await database.run(updateTodoQuery);
      response.send(`${updateColumn} Updated`);
    } else {
      response.status(400).send(ErrorResult);
    }
  } catch (error) {
    response.status(400).send(ErrorResult);
  }
});

//#endregion

//#region API - 6
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteTodoQuery = `
  DELETE FROM
    todo
  WHERE
    id = ${todoId};`;

  await database.run(deleteTodoQuery);
  response.send("Todo Deleted");
});
//#endregion

module.exports = app;
