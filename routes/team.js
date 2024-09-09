const express = require("express");

const teamController = require("../controllers/team");
const isAuth = require("../middleware/isAuth");
const checkPermissions = require('../middleware/permissions');

const router = express.Router();

router.get("/", isAuth, teamController.getAllTeams);

router.get("/:teamId", isAuth, teamController.getTeamById);

router.post("/", isAuth, teamController.createTeam);

router.put('/:teamId/title', isAuth, checkPermissions(['manage_everything']), teamController.updateTeamTitle);

router.put('/:teamId/update-member', isAuth, checkPermissions(['manage_everything']), teamController.updateTeamMember); // ?updateMode=add ?updateMode=remove

router.put('/:teamId/update-member-role', isAuth, checkPermissions(['manage_everything']), teamController.updateTeamMemberRole); 

router.put('/:teamId/update-admin', isAuth, checkPermissions(['manage_everything']), teamController.updateTeamAdmins); // ?updateMode=add ?updateMode=remove

router.delete("/:teamId", isAuth, checkPermissions(['manage_everything']), teamController.deleteTeam);

//team's task related routes are in the task router

module.exports = router;
