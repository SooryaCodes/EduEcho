import { Router } from 'express';
import {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserStats,
} from '../controllers/userController';
import { validate, userSchema } from '../middleware/validation';

const router = Router();

router.post('/', validate(userSchema), createUser);
router.get('/', getAllUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/:id/stats', getUserStats);

export default router;

