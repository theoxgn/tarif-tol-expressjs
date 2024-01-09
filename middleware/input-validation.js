const { check } = require("express-validator");

exports.createUserValidation = [
    check('name', 'Nama Tidak Boleh Kosong').not().isEmpty(),
    check('phone', 'Phone Tidak Boleh Kosong').not().isEmpty(),
    check('email', 'Email Tidak Boleh Kosong').not().isEmpty(),
    check('password', 'Password Tidak Boleh Kosong').not().isEmpty(),
    check('password', 'Password minimal 6 karakter').isLength({ min: 6})
]
exports.loginValidation = [
    check('email', 'email tidak boleh kosong').not().isEmpty(),
    check('password', 'Password tidak boleh kosong').not().isEmpty()
]