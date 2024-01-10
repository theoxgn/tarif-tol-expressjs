var express = require('express');
var router = express.Router();
const {createUserValidation, loginValidation, updateUserValidation} = require('../../middleware/input-validation');
const { authenticateJWT } = require('../../middleware/authentication');

router.get("/", (req, res) => {
    return res.send({
        project:'API v1 Web Service untuk Tarif Tol'
    });
});

var tolApi = require('../../api/controller/TolController');
// User untuk routing dan set response
router.get('/getUserAll', tolApi.getall);
router.post('/postCreateUser', createUserValidation, tolApi.create);
router.post('/postGetUser', tolApi.get);
router.post('/user/login', loginValidation, tolApi.login);
router.put('/putUpdateUser/:id', authenticateJWT, updateUserValidation, tolApi.update);
router.post('/putUpdateUser/:id', authenticateJWT, updateUserValidation, tolApi.update);

module.exports = router;