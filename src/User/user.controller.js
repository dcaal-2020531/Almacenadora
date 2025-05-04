import User from "./user.model.js"
import { checkPassword } from '../../utils/encrypt.js'; // Importa checkPassword

export const getAll = async (req, res) => {
    try {
        const { limit = 20, skip = 0 } = req.query
        const users = await User.find()
            .skip(skip)
            .limit(limit)

        if (users.length === 0) return res.status(404).send({ message: 'Users not found', success: false })
        return res.send(
            {
                success: true,
                message: 'Users found: ',
                users,
                total: users.length
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                err
            }
        )
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

       

        // Realizar la actualización
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

        return res.send({ message: 'Profile updated successfully', updatedUser });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating user profile', err });
    }
};


export const deleteUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { currentPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const isMatch = await checkPassword(user.password, currentPassword);
        if (!isMatch) {
            return res.status(401).send({ message: 'Incorrect password' });
        }

        await User.findByIdAndDelete(userId);

        return res.send({ message: 'User profile deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting user profile', err });
    }
}

