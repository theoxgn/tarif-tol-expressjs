var Tol = require("../models/Tol");
const knex = require("../../db/knex");
const bcrypt = require("bcrypt");
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const moment = require('moment');

exports.get = async function (req, res) {

    /* #swagger.tags = ['User']
        #swagger.description = 'Endpoint to Get All User' */
    /* #swagger.parameters['body'] = {
        name: 'user',
        in: 'body',
        description: 'User information.',
        required: true,
        schema: { $ref: '#/definitions/UserGetFormat' }
    } */
    /* #swagger.security = [{
        "apiKeyAuth": []
    }] */

    const param = req.body;
    const id = param.id;
    try {
        let users = await knex.raw(`select * from users where "ID" = ${id}`)
        if (users.rows.length > 0){
            return res.status(200).json({
                    success: true,
                    data: users.rows,
                });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

exports.getall = async function (req, res) {
  try {
    let users = await Tol.query();
    if (users.length > 0) {
      res.status(200).json({
        success: true,
        data: users,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Data tidak detmukan!",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.create = async function (req, res) {

    /* #swagger.tags = ['User']
        #swagger.description = 'Endpoint to createUser' */
    /* #swagger.parameters['body'] = {
        name: 'user',
        in: 'body',
        description: 'User information.',
        required: true,
        schema: { $ref: '#/definitions/UserRequestFormat' }
    } */
    /* #swagger.security = [{
        "apiKeyAuth": []
    }] */

    // req body
    const data = req.body;
    const hashedPassword = await bcrypt.hash(data.password, 10)
    //validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({
        success: false,
        errors: errors.array()
    });
    try {
        await Tol.query().insert({
            "Name": data.name,
            "Phone": data.phone,
            "Email": data.email,
            "Password": hashedPassword,
        })
        .returning(["Name", "Email", "Phone"])
        .then(async (users) => {
            res.status(200).json({
                success: true,
                message: "Anda Berhasil Terdaftar di Sistem! ",
                data: {
                    name: users.Name,
                    email: users.Email,
                    phone: users.Phone,
                },
            });
        })
        .catch((error) => {
            console.log("ERR:", error);
            res.json({
                success: false,
                message: `Registrasi Gagal, ${error.nativeError.detail} `,
            });
        });
    } catch (error) {
        console.log(error);
        res.json({
        success: false,
        message: "Registrasi Gagal, Internal server error !",
        });
    }
};

exports.login = async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    try {
        const data = req.body;
        const email = data.email;
        const password = data.password;
        const cek_user = await Tol.query().where((builder) => {
            builder.where("Email", email);
        });
        console.log("USER:", cek_user);
        if (cek_user.length > 0) {
            const data_user = cek_user[0];
            bcrypt.compare(password, data_user.Password).then(async (isAuthenticated) => {
                if (!isAuthenticated) {
                res.json({
                    success: false,
                    message: "Password yang Anda masukkan, salah !",
                });
                } else {
                    const data_jwt = {
                        email: data_user.username,
                        email: data_user.email,
                    };
                    const jwt_token = jwt.sign(data_jwt, process.env.API_SECRET, {
                        expiresIn: "10m",
                    });
                    res.status(200).json({
                        success: true,
                        data: data_jwt,
                        jwt_token,
                    });
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Username atau Email tidak terdaftar !",
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

exports.update = async function (req, res) {
    const data = req.body;
    const { id } = req.params;
    // Check Form Validation
    const errors = validationResult(req);
    if (!errors.isEmpty())
    return res.status(400).json({
        success: false,
        errors: errors.array(),
    });
    try {
        const cek_user = await knex.raw(`select * from users where "ID" = ${id}`)
        // const cek_user = await User.query().where((builder) => {
        //     builder.where("Email", data.email);
        // }).where("ID", "<>", id)
        .then((onCheck) => {
            console.log("Check, is Exist in other row :", onCheck);
            return onCheck;
        })
        .catch((err) => {
            console.log("err", err);
            return err;
        });
        console.log("CEK USER:", cek_user);
        // Cek Jika data ada, maka beri return Data Email dan Username sudah terdaftar;
        if (cek_user.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email Sudah Terdaftar !",
            });
        } else {
            const dataUpdate = await User
            .query()
            .patch({
                Name: data.name,
                Email: data.email,
                Phone: data.phone
                // LastEdited: moment(new Date()).format("YYYY-MM-DDHH:mm:ss"),
            })
            .where("ID", id)
            .returning("Name", "Email")
            .first()
            .then((resp) => {
                console.log("RESP:", resp);
                res.status(200).json({
                    success: true,
                    message: "Data user berhasil di Update",
                    data: resp,
                });
            })
            .catch((err) => {
                res.status(500).json({
                    success: false,
                    message: "Data user gagal di Update !",
                });
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
                success: false,
                message: "Data user gagal di Update !",
        });
    }
};

exports.updateFotoProfil = async function(req, res){

    /* #swagger.tags = ['User']
        #swagger.description = 'Endpoint untuk mengUpdate Foto Profil User' */
    /* #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['file'] = {
        type: 'file',
        in: 'formData',
        description: 'Foto profil user.',
        required: true
    } */
    
    const file = req.file;
    const { id } = req.params
    try {
        const dataUpdate = await User
        .query()
        .patch({
            foto:'uploads/'+ file.filename,
            updated_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        })
        .where('id', id)
        .returning('id','nama', 'foto')
        .first()
        .then(resp => {
            res.status(200).json({
                success: true,
                message: 'Data user berhasil di Update',
                data: resp
            })
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: 'Data user gagal di Update !'
            })
        });
        
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: 'data gagal update'
        })
    }
}
  