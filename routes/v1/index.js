var express = require("express");
var router = express.Router();
var cors = require("cors");

var app = express();
const {
  createUserValidation,
  loginValidation,
  updateUserValidation,
} = require("../../middleware/input-validation");
const { authenticateJWT } = require("../../middleware/authentication");
const { upload } = require("../../middleware/file");
const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];

app.use(
  cors({
    origin: "*",
    origin: allowedOrigins,
    credentials: true,
  })
);
router.use(
  cors({
    origin: "*",
    origin: allowedOrigins,
    credentials: true,
  })
);

router.get("/", (req, res) => {
  return res.send({
    project: "API v1 Web Service ",
  });
});

var userApi = require("../../api/controller/TolController");
// User untuk routing dan set response
router.get("/getUserAll", cors(), userApi.getall);
router.post("/postCreateUser", cors(), createUserValidation, userApi.create);
router.post("/postGetUser", cors(), userApi.get);
router.post("/user/login", cors(), loginValidation, userApi.login);
router.put(
  "/putUpdateUser/:id",
  cors(),
  authenticateJWT,
  updateUserValidation,
  userApi.update
);
router.post(
  "/putUpdateUser/:id",
  authenticateJWT,
  cors(),
  updateUserValidation,
  userApi.update
);
router.put(
  "/user/foto-profil/:id",
  cors(),
  upload("uploads").single("file"),
  userApi.updateFotoProfil
);

module.exports = router;
