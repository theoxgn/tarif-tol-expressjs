var User = require("../models/User");
const knex = require("../../db/knex");
const bcrypt = require("bcrypt");
const { validationResult } = require('express-validator');

exports.get = async function (req, res) {
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
    let users = await User.query();
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
        await User.query().insert({
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
