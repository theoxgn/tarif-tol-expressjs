var express = require('express');
var router = express.Router();
const {createUserValidation} = require('../../middleware/input-validation');

router.get("/", (req, res) => {
    return res.send({
        project:'API v1 Web Service '
    });
});

var userApi = require('../../api/controller/UserController');
// User
router.get('/getUserAll', userApi.getall);
// router.get('/user/:id', userApi.getById);
router.post('/postCreateUser', createUserValidation, userApi.create);
router.post('/postGetUser', userApi.get);
// router.put('/user/:id', userApi.update);
// router.delete('/user/:id', userApi.delete);
module.exports = router;