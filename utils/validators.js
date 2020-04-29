const { body } = require("express-validator");
const User = require("../models/user");

exports.registerValidators = [
  body("email")
    .isEmail()
    .withMessage("Введите корректный емайл")
    .custom(async (value, { req }) => {
      try {
        const user = User.findOne({ email: value });
        if (user) {
          return Promise.reject("Этот емайл уже занят");
        }
      } catch (error) {
        console.log(error);
      }
    })
    .normalizeEmail(),
  body("password", "Пароль должен быть не менее 6 символов")
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
  body("confirm")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Пароли должны совпадать ");
      }
      return true;
    })
    .trim(),
  body("name", "Имя должно быть не менее 3 символов")
    .isLength({ min: 3 })
    .trim(),
];

exports.courseValidators = [
  body("title")
    .isLength({ min: 3 })
    .withMessage("Минимальная длина названия должна быть не менее 3 символов")
    .trim(),
  body("price").isNumeric().withMessage("Введите корректную цену"),
  body("img").isURL().withMessage("Введите корректный url картинки"),
];
