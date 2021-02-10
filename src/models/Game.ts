import { Schema } from 'mongoose';
import validator from 'validator';

export const Game = new Schema({
    id: {
        type: Number,
        required: true
    },
    black: {
        type: String,
        default: null,
        validate(value) {
            if (!validator.isUUID(value, 4))
                throw new Error('Value must be a valid UUIDv4')
        }
    },
    white: {
        type: String,
        default: null,
        validate(value) {
            if (!validator.isUUID(value, 4))
                throw new Error('Value must be a valid UUIDv4');
        }
    },
    pgn: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        required: true,
        validate(value) {
            if (!validator.isDate(value))
                throw new Error('Value must be a valid date');
        }
    },
    winner: String
});
