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

app.use(cors());

// CORS is enabled for the selected origins
let corsOptions = {
  origin: ["http://localhost:5500", "http://localhost:3000"],
};

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
