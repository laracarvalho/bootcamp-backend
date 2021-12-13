import { Request, Response } from 'express'; 
import { User } from '../models/user.model';

interface UserResult {
    _id: string;
    name: string;
    email?: string;
    password?: string;
}

async function view(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(404).json({
            message: 'Usuário não encontrado'
        });
    }

    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({
            message: 'Usuário não encontrado'
        });
    }

    return res.status(200).json({
        user: {
            id: user._id,
            name: user.name
        }
    });
}

async function destroy(req: Request, res: Response) {
    const { id } = req.params;

    const idExists = await User.findById(id);

    if (!idExists) {
        return res.status(404).json({
            message: 'Usuário não encontrado.'
        });
    }

    const deleteUser = await User.findByIdAndDelete(id);
    
    if (!deleteUser) {
        res.status(500).json({
            message: 'Não foi possível deletar o usuário'
        });
    }

    return res.status(200).json({
        message: 'Usuário apagado com sucesso.'
    });
}

export { view, destroy };