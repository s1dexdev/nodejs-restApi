const express = require('express');
const router = express.Router();
const ctrl = require('../../../controllers/users');
const guard = require('../../../helpers/guard');
const upload = require('../../../helpers/upload');
const {
  validateCreateUser,
  validateUpdateSubscription,
} = require('./validation_schema');

router.post('/signup', validateCreateUser, ctrl.signup);
router.post('/login', ctrl.login);
router.post('/logout', guard, ctrl.logout);
router.get('/current', guard, ctrl.current);
router.patch('/avatars', [guard, upload.single('avatar')], ctrl.avatars);
router.patch('/', guard, validateUpdateSubscription, ctrl.update);

module.exports = router;
