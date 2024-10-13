const express = require("express");

const taskController = require("../controllers/task");
const isAuth = require("../middleware/isAuth");
const checkPermissions = require("../middleware/permissions");

const router = express.Router();

/**
 * @swagger
 * /api/task:
 *  get:
 *    summary: Get all tasks for the authenticated user
 *    tags: [Task]
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *          default: 1
 *        description: The page number for pagination
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *          default: 8
 *        description: Number of tasks to retrieve per page
 *      - in: query
 *        name: sort
 *        schema:
 *          type: string
 *          default: createdAt
 *        description: Field to sort tasks by
 *      - in: query
 *        name: category
 *        schema:
 *          type: string
 *        description: Filter tasks by category
 *    responses:
 *      200:
 *        description: Fetched all tasks successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Fetched all tasks successfully
 *                tasks:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Task'
 *      500:
 *        description: Server error, could not fetch tasks
 */
router.get("/", isAuth, taskController.getAllTasks);

/**
 * @swagger
 * /api/task/{id}:
 *  get:
 *    summary: Get a task by ID for the authenticated user
 *    tags: [Task]
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The ID of the task to retrieve
 *    responses:
 *      200:
 *        description: Fetched task successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Fetched task successfully
 *                task:
 *                  $ref: '#/components/schemas/Task'
 *      404:
 *        description: Task does not exist or has been deleted
 *      422:
 *        description: Invalid Task ID format
 */
router.get("/:id", isAuth, taskController.getTaskById);

/**
 * @swagger
 * /api/task:
 *  post:
 *    summary: Create a new task
 *    tags: [Task]
 *    security:
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                example: "New Task"
 *              description:
 *                type: string
 *                example: "Task description here"
 *    responses:
 *      201:
 *        description: Created New Task
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Created New Task
 *                task:
 *                  $ref: '#/components/schemas/Task'
 *      422:
 *        description: Title or description not provided
 */
router.post("/", isAuth, taskController.createTask);

/**
 * @swagger
 * /api/task/{id}:
 *  put:
 *    summary: Update a task by ID
 *    tags: [Task]
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The ID of the task to update
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                example: "Updated Task Title"
 *              description:
 *                type: string
 *                example: "Updated Task Description"
 *              status:
 *                type: string
 *                example: "completed"
 *    responses:
 *      201:
 *        description: Updated Task
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Updated Task
 *                task:
 *                  $ref: '#/components/schemas/Task'
 *      404:
 *        description: Task does not exist or has been deleted
 *      422:
 *        description: Invalid Task ID format
 */
router.put("/:id", isAuth, taskController.updateTask);

/**
 * @swagger
 * /api/task/{id}:
 *  delete:
 *    summary: Delete a task by ID
 *    tags: [Task]
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The ID of the task to delete
 *    responses:
 *      201:
 *        description: Deleted task successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Deleted task successfully
 *      404:
 *        description: Task does not exist or has been deleted'
 *      422:
 *        description: Invalid Task ID format
 */
router.delete("/:id", isAuth, taskController.deleteTask);

//Team Task Control:

/**
 * @swagger
 * /team/{teamId}:
 *   get:
 *     summary: Get all tasks for a team
 *     security:
 *       - BearerAuth: []
 *     tags: [Team Tasks]
 *     parameters:
 *       - in: path
 *         name: teamId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the team
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of tasks per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sorting criteria
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category filter
 *     responses:
 *       200:
 *         description: Fetched all team tasks successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get("/team/:teamId", isAuth, taskController.getAllTeamTasks);

/**
 * @swagger
 * /team/{teamId}/{taskId}:
 *   get:
 *     summary: Get a specific task by ID within a team
 *     security:
 *       - BearerAuth: []
 *     tags: [Team Tasks]
 *     parameters:
 *       - in: path
 *         name: teamId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the team
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the task
 *     responses:
 *       200:
 *         description: Fetched the team task successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
router.get("/team/:teamId/:taskId", isAuth, taskController.getTeamTaskById);

/**
 * @swagger
 * /team/{teamId}:
 *   post:
 *     summary: Create a new task for a team
 *     security:
 *       - BearerAuth: []
 *     tags: [Team Tasks]
 *     parameters:
 *       - in: path
 *         name: teamId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the team
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTask'
 *     responses:
 *       201:
 *         description: Created a new team task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       422:
 *         description: Invalid team ID or missing data
 */
router.post(
  "/team/:teamId",
  isAuth,
  checkPermissions(["create_tasks", "manage_everything"]),
  taskController.createTeamTask
);

/**
 * @swagger
 * /team/{teamId}/{taskId}:
 *   put:
 *     summary: Update a task in a team
 *     security:
 *       - BearerAuth: []
 *     tags: [Team Tasks]
 *     parameters:
 *       - in: path
 *         name: teamId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the team
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the task
 *       - in: query
 *         name: updateMode
 *         schema:
 *           type: string
 *           enum: [update, assign]
 *         required: true
 *         description: Mode of update
 *     requestBody:
 *       required: true
 *       description: "You can send either an update for task details or assign a task to a user. Use `UpdateTask` schema to update task properties (title, description, status, etc.) and `AssignTask` schema to assign the task to a specific user."
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/UpdateTask'
 *               - $ref: '#/components/schemas/AssignTask'
 *           examples:
 *              updateTaskExample:
 *                summary: "Update task details"
 *                value:
 *                  title: "New task title"
 *                  description: "Updated task description"
 *                  status: "In Progress"
 *                  priority: "High"
 *              assignTaskExample:
 *                summary: "Assign task to a user"
 *                value:
 *                  assigneeId: "64758a3342f0910234ac95a5"
 *     responses:
 *       201:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */
router.put(
  "/team/:teamId/:taskId",
  isAuth,
  checkPermissions([
    "update_any_tasks",
    "assign_tasks",
    "update_own_tasks",
    "manage_everything",
  ]),
  taskController.updateTeamTask
); // ?updateMode=update ?updateMode=assign

/**
 * @swagger
 * /team/{teamId}/{taskId}:
 *   delete:
 *     summary: Delete a task in a team
 *     security:
 *       - BearerAuth: []
 *     tags: [Team Tasks]
 *     parameters:
 *       - in: path
 *         name: teamId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the team
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the task
 *     responses:
 *       201:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
router.delete(
  "/team/:teamId/:taskId",
  isAuth,
  checkPermissions([
    "delete_any_tasks",
    "delete_own_tasks",
    "manage_everything",
  ]),
  taskController.deleteTeamTask
);

module.exports = router;
