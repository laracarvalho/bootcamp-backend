import { Request, Response } from 'express';
import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';
import { ENV_VARS } from '../index';

const token_secret = process.env.TOKEN_SECRET;

async function create(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(403).json({
            message: 'Usuário já cadastrado'
        });
    }

    const user = new User({ name, email, password });

    user.save((error: any, result: any): void => {
        if (error) {
            console.log('Error: ', typeof error);
            res.json(error);
        }

        console.log('Result: ', typeof result);

        const accessToken = createAccessToken(result._id);

        res.status(201).json(
            {
                user: {
                    id: result._id,
                    name: result.name
                },
                accessToken
            }
        );
    });

}

function createAccessToken(userId: string) {

    let token = ENV_VARS.token_secret as string;

    const accessToken = jwt.sign(
        {
            id: userId
        },
        token,
        {
            expiresIn: 900 // 15min
        }
    );

    return accessToken;
}

export { create };