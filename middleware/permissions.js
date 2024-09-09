const Team = require("../models/team");
const roles = require("../configs/roles");

function checkPermissions(allowedActions) {
  return async (req, res, next) => {
    const userId = req.userId;
    const teamId = req.params.teamId;

    try {
      const team = await Team.findById(teamId);
      if (!team) {
        const error = new Error("Team not found");
        error.statusCode = 404;
        next(error);
      }
      if (team.creator.toString() === userId) {
        req.userRole = "creator";
        return next();
      }
      if (team.admins.includes(userId)) {
        req.userRole = "admin";
        return next();
      }

      const member = team.members.find((m) => m.memberId.toString() === userId);
      const userRole = member ? member.role : null;

      // Check if the user role has any of the allowed actions
      const hasPermission = allowedActions.some((action) =>
        roles[userRole].can.includes(action)
      );

      if (!userRole || !hasPermission) {
        const error = new Error("Permission denied");
        error.statusCode = 403;
        next(error);
      }

      req.userRole = userRole;
      req.member = member;
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = checkPermissions;
