const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Task Manager API",
    version: "v1.0",
    description: "An Advanced Role-based Task management API",
  },
  servers: [
    {
      url: "http://localhost:3000",
    },
    {
      url: "https://task-manager-api-wheat.vercel.app",
    },
  ],
  components: {
    schemas: {
      Task: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            example: "64758a3342f0910234ac95a2",
          },
          title: {
            type: "string",
            example: "Complete Swagger Documentation",
          },
          description: {
            type: "string",
            example: "Write detailed Swagger docs for task endpoints",
          },
          status: {
            type: "string",
            example: "Not Started",
          },
          priority: {
            type: "string",
            example: "High",
            nullable: true,
          },
          deadline: {
            type: "string",
            format: "date-time",
            example: "2023-10-20T10:00:00.000Z",
            nullable: true,
          },
          creatorId: {
            type: "string",
            example: "64758a3342f0910234ac95b3",
          },
          teamId: {
            type: "string",
            example: "64758a3342f0910234ac95a4",
            nullable: true,
          },
          assignedTo: {
            type: "string",
            example: "64758a3342f0910234ac95a5",
            nullable: true,
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2023-10-12T09:32:45.234Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2023-10-12T09:35:23.567Z",
          },
        },
      },
      CreateTask: {
        type: "object",
        required: ["title", "description"],
        properties: {
          title: {
            type: "string",
            example: "Complete Swagger Documentation",
          },
          description: {
            type: "string",
            example: "Write detailed Swagger docs for task endpoints",
          },
        },
      },
      UpdateTask: {
        type: "object",
        properties: {
          title: {
            type: "string",
            example: "New title for the task",
          },
          description: {
            type: "string",
            example: "Updated description",
          },
          status: {
            type: "string",
            example: "In Progress",
          },
          priority: {
            type: "string",
            example: "High",
            nullable: true,
          },
          deadline: {
            type: "string",
            format: "date-time",
            example: "2023-10-20T10:00:00.000Z",
            nullable: true,
          },
        },
      },
      AssignTask: {
        type: "object",
        properties: {
          assigneeId: {
            type: "string",
            example: "64758a3342f0910234ac95a5",
          },
        },
      },
      User: {
        type: "object",
        properties: {
          email: {
            type: "string",
            example: "test@test.com",
          },
          password: {
            type: "string",
            example: "hashedPassword",
          },
          _id: {
            type: "string",
            example: "238547298",
          },
        },
      },
    },
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: [
    "./app.js",
    "./routes/auth.js",
    "./routes/task.js",
    "./routes/team.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
