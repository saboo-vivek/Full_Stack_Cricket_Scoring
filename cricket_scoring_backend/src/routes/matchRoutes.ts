import express from 'express';
import { createMatch, getMatch } from '../controllers/matchController';

const router = express.Router();

router.post('/', createMatch);
router.get('/:id', getMatch);

export default router;
