var express = require('express');
var router = express.Router();
const {createUserValidation, loginValidation} = require('../../middleware/input-validation');

router.get("/", (req, res) => {
    return res.send({
        project:'API v1 Web Service '
    });
});

var userApi = require('../../api/controller/UserController');
// User
router.get('/getUserAll', userApi.getall);
router.post('/postCreateUser', createUserValidation, userApi.create);
router.post('/postGetUser', userApi.get);
router.post('/user/login', loginValidation, userApi.login);

module.exports = router;