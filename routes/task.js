const express = require("express");

const taskController = require("../controllers/task");
const isAuth = require("../middleware/isAuth");
const checkPermissions = require('../middleware/permissions');


const router = express.Router();

router.get("/", isAuth, taskController.getAllTasks);

router.get("/:id", isAuth, taskController.getTaskById);

router.post("/", isAuth, taskController.createTask);

router.put("/:id", isAuth, taskController.updateTask);

router.delete("/:id", isAuth, taskController.deleteTask);

//Team Task Control:

router.get("/team/:teamId", isAuth, taskController.getAllTeamTasks);

router.get("/team/:teamId/:taskId", isAuth, taskController.getTeamTaskById);

router.post("/team/:teamId", isAuth, checkPermissions(['create_tasks', 'manage_everything']), taskController.createTeamTask);

router.put("/team/:teamId/:taskId", isAuth, checkPermissions(['update_any_tasks', 'assign_tasks', 'update_own_tasks', 'manage_everything']), taskController.updateTeamTask); // ?updateMode=update ?updateMode=assign

router.delete("/team/:teamId/:taskId", isAuth, checkPermissions(['delete_any_tasks', 'delete_own_tasks', 'manage_everything']), taskController.deleteTeamTask);

module.exports = router;
