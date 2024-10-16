const express = require("express");

const teamController = require("../controllers/team");
const isAuth = require("../middleware/isAuth");
const checkPermissions = require('../middleware/permissions');

const router = express.Router();

/**
 * @swagger
 * /api/team:
 *   get:
 *     summary: Retrieve all teams a user has made or is a part of
 *     tags: [Teams]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: Number of teams per page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 4
 *       - name: sort
 *         in: query
 *         description: Sort teams by a specified field
 *         required: false
 *         schema:
 *           type: string
 *           default: "createdAt"
 *       - name: category
 *         in: query
 *         description: Filter teams by category
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of teams
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   
 *                 teams:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Team'
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Failed to fetch teams
 */
router.get("/", isAuth, teamController.getAllTeams);

/**
 * @swagger
 * /api/team/{teamId}:
 *   get:
 *     summary: Retrieve a team by ID
 *     tags: [Teams]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: teamId
 *         in: path
 *         description: ID of the team to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A team object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 team:
 *                   $ref: '#/components/schemas/Team'
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: No team found
 *       422:
 *         description: Invalid TeamID
 */
router.get("/:teamId", isAuth, teamController.getTeamById);

/**
 * @swagger
 * /api/team:
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: MyTeam1
 *             required:
 *               - title
 *     responses:
 *       201:
 *         description: Team created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 team:
 *                   $ref: '#/components/schemas/Team'
 *       401:
 *         description: User not authenticated
 *       422:
 *         description: Title not provided
 */
router.post("/", isAuth, teamController.createTeam);

/**
 * @swagger
 * /api/team/{teamId}/title:
 *   put:
 *     summary: Update the title of a team
 *     tags: [Teams]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: teamId
 *         in: path
 *         description: ID of the team to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *             required:
 *               - title
 *     responses:
 *       200:
 *         description: Team title updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 team:
 *                   $ref: '#/components/schemas/Team'
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: You don't have permissions for this action
 *       404:
 *         description: No team found
 *       422:
 *         description: Invalid TeamID
 */
router.put('/:teamId/title', isAuth, checkPermissions(['manage_everything']), teamController.updateTeamTitle);

/**
 * @swagger
 * /api/team/{teamId}/update-member:
 *   put:
 *     summary: Add or Remove a member from the team (pass 'add' or 'remove' in the update mode in the body to control the mode)
 *     tags: [Teams]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: teamId
 *         in: path
 *         description: ID of the team to update
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: updateMode
 *         required: true
 *         schema:
 *           type: string
 *           enum: [add, remove]
 *         description: Mode of updating the member (either 'add' or 'remove').
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               memberId:
 *                 type: string
 *                 example: 670be606931e26986c31fae7
 *             required:
 *               - memberId
 *     responses:
 *       200:
 *         description: Member updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 team:
 *                   $ref: '#/components/schemas/Team'
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: You don't have permissions for this action
 *       404:
 *         description: Member not found
 *       422:
 *         description: Invalid TeamID or User ID
 */
router.put('/:teamId/update-member', isAuth, checkPermissions(['manage_everything']), teamController.updateTeamMember); // ?updateMode=add ?updateMode=remove

/**
 * @swagger
 * /api/team/{teamId}/update-member-role:
 *   put:
 *     summary: Update a member's role in the team
 *     tags: [Teams]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: teamId
 *         in: path
 *         description: ID of the team to update
 *         required: true
 *         schema:
 *           type: string
 *       - name: role
 *         in: query
 *         description: Role of the member in the team
 *         required: true
 *         schema:
 *           type: string
 *           enum: [member, contributor, editor, projectManager]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               memberId:
 *                 type: string
 *                 example: "66cda7320fab20701d82b7f0"
 *             required:
 *               - memberId
 *     responses:
 *       200:
 *         description: Member's role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 member:
 *                   type: object
 *                   properties:
 *                     memberId:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: You don't have permissions for this action
 *       404:
 *         description: No such member found in the team
 *       422:
 *         description: Invalid TeamID or User ID
 */
router.put('/:teamId/update-member-role', isAuth, checkPermissions(['manage_everything']), teamController.updateTeamMemberRole); 

/**
 * @swagger
 * /api/team/{teamId}/update-admin:
 *   put:
 *     summary: Update team admins
 *     tags: [Teams]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: teamId
 *         in: path
 *         description: ID of the team to update
 *         required: true
 *         schema:
 *           type: string
 *       - name: updateMode
 *         in: query
 *         description: Specify whether to add or remove a member
 *         required: true
 *         schema:
 *           type: string
 *           enum: [add, remove]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               memberId:
 *                 type: string
 *                 example: "66cda7320fab20701d82b7f0"
 *             required:
 *               - memberId
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 team:
 *                   $ref: '#/components/schemas/Team'
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: You don't have permissions for this action
 *       404:
 *         description: No such Admins found in your team
 *       422:
 *         description: Invalid TeamID or User ID
 */
router.put('/:teamId/update-admin', isAuth, checkPermissions(['manage_everything']), teamController.updateTeamAdmins); // ?updateMode=add ?updateMode=remove

/**
 * @swagger
 * /api/team/{teamId}:
 *   delete:
 *     summary: Delete a team by ID
 *     tags: [Teams]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: teamId
 *         in: path
 *         description: ID of the team to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Team deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: You don't have permissions for this action
 *       404:
 *         description: No team found
 */
router.delete("/:teamId", isAuth, checkPermissions(['manage_everything']), teamController.deleteTeam);

//team's task related routes are in the task router

module.exports = router;
