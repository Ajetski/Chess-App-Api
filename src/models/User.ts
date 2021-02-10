import { Schema, model, Types } from 'mongoose';
import validator from 'validator';

const userSchema = new Schema({
    uuid: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isUUID(value, 4)) {
                throw new Error('Value must be a valid UUIDv4');
            }
        }
    },
    username: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isAlphanumeric(value)) {
                throw new Error('Invalid Username');
            }
        }

    },
    email: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email');
            }
        }
    },
    elo: {
        ranking: {
            type: Types.Decimal128,
            default: 1000.00,
            required: true
        },
        provisional: {
            type: Boolean,
            default: true,
            required: true
        }
    },
});

export const User = model('User', userSchema);
