const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReactionSchema = new Schema(
    {
        reactionBody: {
            type: String, 
            required: 'Input required!',
            maxLength: 280
        },
        username: {
            type: String, 
            required: 'username required!'
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
          }
    },
    {
        toJSON: {
          getters: true
        },
        id: false
      }
)

const ThoughtSchema = new Schema (
    {
    thoughtText: {
        type: String,
        required: 'Input required!',
        maxLength: 280
      },
      createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
      },
      username: {
          type: String, 
          required: 'Username required!',
      },
      reactions: [ReactionSchema]
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
  }
)

ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
  });

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;