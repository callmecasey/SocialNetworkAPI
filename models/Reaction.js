const { Schema, Types } = require("mongoose");
const dayjs = require("dayjs");

const reactionSchema = new Schema({
  reactionId: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  username: {
    type: String,
    required: true,
  },
  reactionBody: {
    type: String,
    required: true,

    max: 280,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    get: ts => dayjs(ts).format("MM/DD/YYYY")
  },

},{
  toJSON: {
    getters: true
  },
  id: false, _id: false
});


module.exports = reactionSchema;
