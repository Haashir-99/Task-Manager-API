const mongoose = require("mongoose");

const Task = require("../models/task");
const User = require("../models/user");
const Team = require("../models/team");

exports.getAllTasks = async (req, res, next) => {
  const userId = req.userId;
  const page = req.query.page || 1;
  const limit = req.query.limit || 8;
  const sort = req.query.sort || "createdAt";
  const category = req.query.category;

  try {
    const filter = { creatorId: userId, teamId: null };
    if (category) {
      filter.category = category;
    }
    const tasks = await Task.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort);
    if (!tasks) {
      const error = new Error("Could not fetch tasks.");
      error.statusCode = 500;
      throw error;
    }
    if (tasks.length === 0) {
      return res.status(200).json({
        message: "You currently have no tasks",
        tasks: tasks,
      });
    }

    res.status(200).json({
      message: "Fetched all tasks successfully",
      tasks: tasks,
    });
  } catch (err) {
    next(err);
  }
};

exports.getTaskById = async (req, res, next) => {
  const userId = req.userId;
  const taskId = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      const error = new Error("Invalid Task ID format.");
      error.statusCode = 422;
      throw error;
    }
    const task = await Task.findOne({
      _id: taskId,
      creatorId: userId,
      teamId: null,
    });
    if (!task) {
      const error = new Error("Task does not exit or has been deleted.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: "Fetched task successfully",
      task: task,
    });
  } catch (err) {
    next(err);
  }
};

exports.createTask = async (req, res, next) => {
  const userId = req.userId;
  const title = req.body.title;
  const description = req.body.description;
  try {
    if (!title || !description) {
      const error = new Error("title or description not provided");
      error.statusCode = 422;
      throw error;
    }
    const task = new Task({
      title: title,
      description: description,
      creatorId: userId,
    });
    await task.save();

    res.status(201).json({
      message: "Created New Task",
      task: task,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  const userId = req.userId;
  const taskId = req.params.id;
  const newTitle = req.body.title;
  const newDescription = req.body.description;
  const newStatus = req.body.status;
  try {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      const error = new Error("Invalid Task ID format.");
      error.statusCode = 422;
      throw error;
    }
    const task = await Task.findOne({
      _id: taskId,
      creatorId: userId,
      teamId: null,
    });
    if (!task) {
      const error = new Error("Task does not exit or has been deleted.");
      error.statusCode = 404;
      throw error;
    }
    if (newTitle) {
      task.title = newTitle;
    }
    if (newDescription) {
      task.description = newDescription;
    }
    if (newStatus) {
      task.status = newStatus;
    }
    await task.save();

    res.status(201).json({
      message: "Updated Task",
      task: task,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  const userId = req.userId;
  const taskId = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      const error = new Error("Invalid Task ID format.");
      error.statusCode = 422;
      throw error;
    }
    const task = await Task.findOne({
      _id: taskId,
      creatorId: userId,
      teamId: null,
    });
    if (!task) {
      const error = new Error("Task does not exit or has been deleted.");
      error.statusCode = 404;
      throw error;
    }
    await Task.findByIdAndDelete(taskId);

    res.status(201).json({
      message: "Deleted task successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Team Task Control

exports.getAllTeamTasks = async (req, res, next) => {
  const userId = req.userId;
  const teamId = req.params.teamId;
  const page = req.query.page || 1;
  const limit = req.query.limit || 8;
  const sort = req.query.sort || "createdAt";
  const category = req.query.category;
  try {
    const filter = { creatorId: userId, teamId: teamId };
    if (category) {
      filter.category = category;
    }
    const tasks = await Task.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort);
    if (!tasks) {
      const error = new Error("Could not fetch tasks.");
      error.statusCode = 500;
      throw error;
    }

    res.status(200).json({
      message: "Fetched all team tasks successfully",
      tasks: tasks,
    });
  } catch (err) {
    next(err);
  }
};

exports.getTeamTaskById = async (req, res, next) => {
  const userId = req.userId;
  const taskId = req.params.taskId;
  const teamId = req.params.teamId;
  try {
    if (
      !mongoose.Types.ObjectId.isValid(taskId) ||
      !mongoose.Types.ObjectId.isValid(teamId)
    ) {
      const error = new Error("Invalid team/task ID format.");
      error.statusCode = 422;
      throw error;
    }
    const task = await Task.findOne({
      _id: taskId,
      creatorId: userId,
      teamId: teamId,
    });
    if (!task) {
      const error = new Error("Task does not exit or has been deleted.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: "Fetched team task successfully",
      task: task,
    });
  } catch (err) {
    next(err);
  }
};

exports.createTeamTask = async (req, res, next) => {
  const userId = req.userId;
  const userRole = req.userRole;
  const teamId = req.params.teamId;
  const title = req.body.title;
  const description = req.body.description;
  try {
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      const error = new Error("Invalid TeamID");
      error.statusCode = 422;
      throw error;
    }
    if (!title || !description) {
      const error = new Error("title or description not provided");
      error.statusCode = 422;
      throw error;
    }
    if (userRole === "member") {
      const error = new Error(
        "You do not have permission to create a task in this team."
      );
      error.statusCode = 403;
      throw error;
    }
    const task = new Task({
      title: title,
      description: description,
      creatorId: userId,
      teamId: teamId,
    });
    await task.save();

    res.status(201).json({
      message: "Created a New Team Task",
      task: task,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateTeamTask = async (req, res, next) => {
  const userId = req.userId;
  const userRole = req.userRole;
  const teamId = req.params.teamId;
  const taskId = req.params.taskId;
  const updateMode = req.query.updateMode;
  try {
    if (
      !mongoose.Types.ObjectId.isValid(taskId) ||
      !mongoose.Types.ObjectId.isValid(teamId)
    ) {
      const error = new Error("Invalid team/task ID format.");
      error.statusCode = 422;
      throw error;
    }
    const task = await Task.findOne({
      _id: taskId,
      teamId: teamId,
    });
    if (!task) {
      const error = new Error("Task does not exit or has been deleted.");
      error.statusCode = 404;
      throw error;
    }

    if (userRole === "contributor") {
      if (updateMode === "assign") {
        const error = new Error("You do not have the permission assign tasks.");
        error.statusCode = 403;
        throw error;
      }
      if (task.creatorId.toString() !== userId) {
        const error = new Error("You can only update your own tasks.");
        error.statusCode = 403;
        throw error;
      }
    }
    if (userRole === "editor" && updateMode === "assign") {
      const error = new Error(
        "You do not have the permission to assign tasks."
      );
      error.statusCode = 403;
      throw error;
    }

    let message;
    if (updateMode === "update") {
      const newTitle = req.body.title;
      const newDescription = req.body.description;
      const newStatus = req.body.status;
      const newDeadline = req.body.deadline;
      const newPriority = req.body.priority;
      if (newTitle) {
        task.title = newTitle;
      }
      if (newDescription) {
        task.description = newDescription;
      }
      if (newStatus) {
        task.status = newStatus;
      }
      if (newDeadline) {
        const finalDeadline = new Date(newDeadline);
        task.deadline = finalDeadline;
      }
      if (newPriority) {
        task.priority = newPriority;
      }
      message = "Updated Team Task";
    } else if (updateMode === "assign") {
      const assigneeId = req.body.assigneeId || null;
      if (assigneeId) {
        const isInTeam = await Team.findOne({
          $or: [
            { creator: assigneeId },
            { admins: assigneeId },
            { "members.memberId": assigneeId },
          ],
        });
        if (!isInTeam) {
          const error = new Error("Member is not in your team");
          error.statusCode = 422;
          throw error;
        }
        task.assignedTo = assigneeId;
        message = "Assigned Task to Member";
      } else {
        task.assignedTo = assigneeId;
        message = "Removed Task Assignee";
      }
    } else {
      const error = new Error("Update mode not defined");
      error.statusCode = 401;
      throw error;
    }

    await task.save();

    res.status(201).json({
      message: message,
      task: task,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteTeamTask = async (req, res, next) => {
  const userId = req.userId;
  const userRole = req.userRole;
  const taskId = req.params.taskId;
  const teamId = req.params.teamId;
  try {
    if (
      !mongoose.Types.ObjectId.isValid(taskId) ||
      !mongoose.Types.ObjectId.isValid(teamId)
    ) {
      const error = new Error("Invalid Task ID format.");
      error.statusCode = 422;
      throw error;
    }
    const task = await Task.findOne({
      _id: taskId,
      teamId: teamId,
    });
    if (!task) {
      const error = new Error("Task does not exit or has been deleted.");
      error.statusCode = 404;
      throw error;
    }
    if (userRole === "member") {
      const error = new Error(
        "You do not have the permission to delete tasks in this team."
      );
      error.statusCode = 403;
      throw error;
    }
    if (userRole === "contributor" && task.creatorId.toString() !== userId) {
      const error = new Error("You can only delete your own tasks.");
      error.statusCode = 403;
      throw error;
    }
    await Task.findByIdAndDelete(taskId);

    res.status(201).json({
      message: "Deleted team task successfully",
    });
  } catch (err) {
    next(err);
  }
};
