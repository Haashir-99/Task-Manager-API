const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/auth");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

// POST /register
/**
 * @swagger
 * tags:
 *  - name: Authentication
 *    description: Contains Endpoints that handles authentication such as signup and login etc.
 * /api/auth/register:
 *  post:
 *    summary: SignUp a new user
 *    tags: [Authentication]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                example: test@test.com
 *              password:
 *                type: string
 *                example: password12345
 *              confirmedPassword:
 *                type: string
 *                example: password12345
 *    responses:
 *      201:
 *        description: User Created Successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Created User Successfully
 *                user:
 *                  $ref: '#/components/schemas/User'
 *      422:
 *        description: Invalid Input
 */
router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("confirmedPassword").trim().isLength({ min: 5 }),
  ],
  authController.postSignup
);

// POST /login
/**
 * @swagger
 * /api/auth/login:
 *  post:
 *    summary: Login a signed up user
 *    tags: [Authentication]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                example: test@test.com
 *              password:
 *                type: string
 *                example: password12345
 *    responses:
 *      200:
 *        description: Logged in user successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: object
 *                  example: Logged in user Successfully
 *                userId:
 *                  type: string
 *                  example: 64758a3342f0910234ac95a2
 *                token:
 *                  type: string
 *                  example: aJsonWebToken
 *      404:
 *        description: User does not exist
 *      422:
 *        description: Invalid Input
 */
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
  ],
  authController.postLogin
);

// DELETE /deleteAccount
/**
 * @swagger
 * /api/auth/deleteAccount:
 *  delete:
 *    summary: Delete a user from the database
 *    tags: [Authentication]
 *    security:
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              password:
 *                type: string
 *                example: password12345
 *    responses:
 *      201:
 *        description: Deleted user Successfully
 *        content:
 *          application/json:
 *            schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Deleted user Successfully
 *      404:
 *        description: User does not exist
 *      422:
 *        description: Invalid Input
 */
router.delete("/deleteAccount", isAuth, authController.postDeleteAccount);

module.exports = router;
