const router = require('express').Router();
const authController = require('../controllers/auth_controller');
const userController = require('../controllers/user_controller');

//auth
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.get("/logout", authController.logout);

// user display: 'block',
router.get("/", userController.getAllUsers);
router.get("/:id", userController.userInfo);
router.put("/:id", userController.userUpdate);
router.delete("/:id", userController.deleteUser);
router.patch("/follow/:id", userController.follower);
router.patch("/unfollow/:id", userController.unfollow);

module.exports = router;
