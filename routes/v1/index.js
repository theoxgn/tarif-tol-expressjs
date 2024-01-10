var express = require('express');
var router = express.Router();
const {createUserValidation, loginValidation, updateUserValidation} = require('../../middleware/input-validation');
const { authenticateJWT } = require('../../middleware/authentication');

router.get("/", (req, res) => {
    return res.send({
        project:'API v1 Web Service '
    });
});

var userApi = require('../../api/controller/UserController');
// User untuk routing dan set response
router.get('/getUserAll', userApi.getall);
router.post('/postCreateUser', createUserValidation, userApi.create);
router.post('/postGetUser', userApi.get);
router.post('/user/login', loginValidation, userApi.login);
router.put('/putUpdateUser/:id', authenticateJWT, updateUserValidation, userApi.update);
router.post('/putUpdateUser/:id', authenticateJWT, updateUserValidation, userApi.update);

module.exports = router;