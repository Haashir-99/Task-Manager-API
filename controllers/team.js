const mongoose = require("mongoose");

const Team = require("../models/team");
const User = require("../models/user");

exports.getAllTeams = async (req, res, next) => {
  const userId = req.userId;
  const page = req.query.page || 1;
  const limit = req.query.limit || 4;
  const sort = req.query.sort || "createdAt";
  const category = req.query.category;
  try {
    if (!userId) {
      const error = new Error("User not authenticated");
      error.statusCode = 401;
      throw error;
    }
    filter = {
      $or: [
        { creator: userId },
        { admins: userId },
        { "members.memberId": userId },
      ],
    };
    if (category) {
      filter.category = category;
    }
    const teams = await Team.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort);
    if (!teams) {
      const error = new Error("Failed to fetch teams");
      error.statusCode = 404;
      throw error;
    }

    res.status(201).json({
      messgae: "Fetched all Teams",
      teams: teams,
    });
  } catch (err) {
    next(err);
  }
};

exports.getTeamById = async (req, res, next) => {
  const userId = req.userId;
  const teamId = req.params.teamId;
  try {
    if (!userId) {
      const error = new Error("User not authenticated");
      error.statusCode = 401;
      throw error;
    }
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      const error = new Error("Invalid TeamID");
      error.statusCode = 422;
      throw error;
    }
    const team = await Team.findOne({
      _id: teamId,
      $or: [
        { creator: userId },
        { admins: userId },
        { "members.memberId": userId },
      ],
    });
    if (!team) {
      const error = new Error("No team found");
      error.statusCode = 404;
      throw error;
    }

    res.status(201).json({
      messgae: "Fetched Team",
      team: team,
    });
  } catch (err) {
    next(err);
  }
};

exports.createTeam = async (req, res, next) => {
  const userId = req.userId;
  try {
    if (!userId) {
      const error = new Error("User not authenticated");
      error.statusCode = 401;
      throw error;
    }
    const title = req.body.title;
    if (!title) {
      const error = new Error("Title not provided");
      error.statusCode = 422;
      throw error;
    }
    const team = new Team({
      title: title,
      creator: userId,
    });
    await team.save();

    res.status(201).json({
      messgae: "Created Team",
      team: team,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateTeamTitle = async (req, res, next) => {
  const userId = req.userId;
  const teamId = req.params.teamId;
  const newTitle = req.body.title;
  const userRole = req.userRole;
  try {
    if (userRole !== "creator" && userRole !== "admin") {
      const error = new Error("You don't have permessions for this action");
      error.statusCode = 403;
      throw error;
    }
    if (!userId) {
      const error = new Error("User not authenticated");
      error.statusCode = 401;
      throw error;
    }
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      const error = new Error("Invalid TeamID");
      error.statusCode = 422;
      throw error;
    }
    const team = await Team.findOne({
      _id: teamId,
      $or: [{ creator: userId }, { admins: userId }],
    });
    if (!team) {
      const error = new Error("No team found");
      error.statusCode = 404;
      throw error;
    }
    if (newTitle) {
      team.title = newTitle;
    }
    await team.save();

    res.status(201).json({
      messgae: "Updated Team Title",
      team: team,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateTeamMember = async (req, res, next) => {
  const userId = req.userId;
  const teamId = req.params.teamId;
  const memberId = req.body.memberId;
  const updateMode = req.query.updateMode;
  const userRole = req.userRole;
  try {
    if (userRole !== "creator" && userRole !== "admin") {
      const error = new Error("You don't have permessions for this action");
      error.statusCode = 403;
      throw error;
    }
    if (!userId) {
      const error = new Error("User not authenticated");
      error.statusCode = 401;
      throw error;
    }
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      const error = new Error("Invalid TeamID");
      error.statusCode = 422;
      throw error;
    }
    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      const error = new Error("Invalid User ID");
      error.statusCode = 422;
      throw error;
    }
    const team = await Team.findOne({
      _id: teamId,
      $or: [{ creator: userId }, { admins: userId }],
    });
    if (!team) {
      const error = new Error("You do not have Permission for that action");
      error.statusCode = 403;
      throw error;
    }
    if (memberId === team.creator.toString()) {
      const error = new Error("Cannot add creator as a member");
      error.statusCode = 400;
      throw error;
    }
    const existingMember = team.members.find(
      (members) => members.memberId.toString() === memberId
    );
    let message;
    if (updateMode === "add") {
      const user = await User.findById(memberId);
      if (!user) {
        const error = new Error("No such user exists");
        error.statusCode = 404;
        throw error;
      }
      if (existingMember) {
        const error = new Error("Member is already in the team");
        error.statusCode = 400;
        throw error;
      }
      team.members.push({ memberId: memberId, role: "member" });
      message = "Added Member";
    } else if (updateMode === "remove") {
      if (!existingMember) {
        const error = new Error("Member not found or has already been deleted");
        error.statusCode = 404;
        throw error;
      }
      const memberIndex = await team.members.findIndex(
        (members) => members.memberId.toString() === memberId
      );
      if (memberIndex !== -1) {
        team.members.splice(memberIndex, 1);
      }
      message = "Deleted Member";
    } else {
      const error = new Error("Update mode not defined in the query parameter");
      error.statusCode = 422;
      throw error;
    }
    await team.save();

    res.status(201).json({
      messgae: message,
      team: team,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateTeamMemberRole = async (req, res, next) => {
  const userId = req.userId;
  const teamId = req.params.teamId;
  const memberId = req.body.memberId;
  const newRole = req.query.role;
  const userRole = req.userRole;
  try {
    if (userRole !== "creator" && userRole !== "admin") {
      const error = new Error("You don't have permessions for this action");
      error.statusCode = 403;
      throw error;
    }
    if (!userId) {
      const error = new Error("User not authenticated");
      error.statusCode = 401;
      throw error;
    }
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      const error = new Error("Invalid TeamID");
      error.statusCode = 422;
      throw error;
    }
    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      const error = new Error("Invalid User ID");
      error.statusCode = 422;
      throw error;
    }
    const team = await Team.findOne({
      _id: teamId,
    });
    if (!team) {
      const error = new Error("No Team Found");
      error.statusCode = 404;
      throw error;
    }
    const member = team.members.find((m) => m.memberId.toString() === memberId);
    if (!member) {
      const error = new Error("No Such member found in the team");
      error.statusCode = 404;
      throw error;
    }
    if (
      newRole !== "member" &&
      newRole !== "contributor" &&
      newRole !== "editor" &&
      newRole !== "projectManager"
    ) {
      const error = new Error("Invalid Role");
      error.statusCode = 422;
      throw error;
    }
    member.role = newRole;

    await team.save();

    res.status(201).json({
      messgae: "Updated member's Role",
      member: member,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateTeamAdmins = async (req, res, next) => {
  const userId = req.userId;
  const teamId = req.params.teamId;
  const memberId = req.body.memberId;
  const updateMode = req.query.updateMode;
  const userRole = req.userRole;
  try {
    if (userRole !== "creator") {
      const error = new Error("You don't have permessions for this action");
      error.statusCode = 403;
      throw error;
    }
    if (!userId) {
      const error = new Error("User not authenticated");
      error.statusCode = 401;
      throw error;
    }
    if (
      !mongoose.Types.ObjectId.isValid(teamId) ||
      !mongoose.Types.ObjectId.isValid(memberId)
    ) {
      const error = new Error("Invalid TeamID");
      error.statusCode = 422;
      throw error;
    }
    const team = await Team.findOne({
      _id: teamId,
      creator: userId,
    });
    if (!team) {
      const error = new Error("Permission Denied");
      error.statusCode = 403;
      throw error;
    }
    if (team.creator.toString() !== userId) {
      const error = new Error("You are not the Owner of this team");
      error.statusCode = 403;
      throw error;
    }

    let message;

    if (updateMode === "add") {
      const existingMember = team.members.find(
        (members) => members.memberId.toString() === memberId
      );
      if (!existingMember) {
        const error = new Error(
          "Member is not in your team or already an admin"
        );
        error.statusCode = 404;
        throw error;
      }
      const memberIndex = await team.members.findIndex(
        (members) => members.memberId.toString() === memberId
      );
      if (memberIndex !== -1) {
        team.members.splice(memberIndex, 1);
      }
      team.admins.push(memberId);
      message = "Made member An Admin";
    } else if (updateMode === "remove") {
      const existingAdmin = team.admins.find(
        (admin) => admin.toString() === memberId
      );
      if (!existingAdmin) {
        const error = new Error("No such Admins found in your team");
        error.statusCode = 404;
        throw error;
      }
      const adminIndex = await team.admins.findIndex(
        (admin) => admin.toString() === memberId
      );

      if (adminIndex !== -1) {
        team.admins.splice(adminIndex, 1);
      }
      team.members.push({ memberId: memberId, role: "member" });

      message = "Made Admin a member";
    } else {
      const error = new Error("Update mode not defined in the query parameter");
      error.statusCode = 422;
      throw error;
    }
    await team.save();

    res.status(201).json({
      messgae: message,
      team: team,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteTeam = async (req, res, next) => {
  const userId = req.userId;
  const teamId = req.params.teamId;
  const userRole = req.userRole;
  try {
    if (userRole !== "creator") {
      const error = new Error("You don't have permessions for this action");
      error.statusCode = 403;
      throw error;
    }
    if (!userId) {
      const error = new Error("User not authenticated");
      error.statusCode = 401;
      throw error;
    }
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      const error = new Error("Invalid TeamID");
      error.statusCode = 422;
      throw error;
    }
    const team = await Team.findOne({
      _id: teamId,
      creator: userId,
    });
    if (!team) {
      const error = new Error("No team found");
      error.statusCode = 404;
      throw error;
    }
    await Team.findByIdAndDelete(teamId);
    res.status(201).json({
      messgae: "Deleted Team",
    });
  } catch (err) {
    next(err);
  }
};
