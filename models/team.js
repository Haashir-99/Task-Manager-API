const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const teamSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    admins: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    members: [
      {
        _id: false,
        memberId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          default: "member",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
