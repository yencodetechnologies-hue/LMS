// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const verifyToken = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', orderController.createOrder);
router.get('/profile/:id', verifyToken, orderController.getRtoProfileById);
router.get('/users', orderController.getRtoUsers);
router.put('/update-logo', verifyToken, upload.single('logo'), orderController.updateRtoLogo);

module.exports = router;