import express from 'express';
import * as playerController from '../controllers/playerController';

const router = express.Router();

router.post('/', playerController.createPlayer);

export default router;

