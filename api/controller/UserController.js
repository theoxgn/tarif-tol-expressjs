var User = require("../models/User");
const knex = require("../../db/knex");
const bcrypt = require("bcrypt");

exports.get = async function (req, res) {
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
  try {
    const data = req.body;
    const salt = await bcrypt.genSalt(10); // Adjust salt rounds as needed
    const hashedPassword = await bcrypt.hash(password, salt);

    bcrypt.hash(data.password, 10).then(async (hashedPassword) => {
      await User.query()
        .insert({
            name: data.name,
            phone: data.phone,
            email: data.email,
            password: hashedPassword,
        })
        .returning(["name", "email", "phone"])
        .then(async (users) => {
          res.status(200).json({
            success: true,
            message: "Anda Berhasil Terdaftar di Sistem Praktikum! ",
            data: {
                name: users.name,
                email: users.email,
                phone: users.phone,
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
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Registrasi Gagal, Internal server error !",
    });
  }
};
