import { Document, Schema, model } from 'mongoose';
import bcryptjs from 'bcryptjs';

interface UserDocument extends Document {
    name: string;
    email: string;
    password: string;
    comparePassword(preHashPassword: string): Promise<boolean>;
}

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
);

UserSchema.pre('save', async function(next) {
    const user = this as UserDocument;

    if (!user.isModified('password')) {
        return next();
    }

    const salt = await bcryptjs.genSalt(12);
    const hash = await bcryptjs.hashSync(user.password, salt);
    user.password = hash;

    return next();
});

UserSchema.methods.comparePassword = async function(preHashPassword: string) {
    const user = this as UserDocument;

    return bcryptjs.compare(preHashPassword, user.password).catch((error) => false);
};

const User = model<UserDocument>("User", UserSchema);

export { User };