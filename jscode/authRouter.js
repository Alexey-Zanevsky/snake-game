const express = require('express');
// const router = new Router();
const router = express.Router();
const controller = require('./authController');
const {check} = require("express-validator");
const authMiddleware = require('./middlware/authMiddleware');

router.post('/registration', [
    check('nickname', "The user name cannot be empty and must be shorter than 20 characters")
    .notEmpty()
    .isLength({ max: 20 }),
    check('password', "The password must be longer than 4 and shorter than 20 characters").isLength({min: 4, max: 20})
] ,controller.registration);
router.post('/login', controller.login);
router.get('/users', authMiddleware ,controller.getUsers);

router.post('/score', authMiddleware, controller.updateScore);
router.get('/ranking/:mode/:difficulty', authMiddleware, controller.getRanking);
router.get('/ranking/hardcore', authMiddleware, controller.getHardcoreRanking);



module.exports = router;