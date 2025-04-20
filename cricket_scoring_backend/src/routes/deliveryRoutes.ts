import express from 'express';
import { recordDelivery } from '../controllers/deliveryController';

const router = express.Router();

router.post('/', recordDelivery);

export default router;
