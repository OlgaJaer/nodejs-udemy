const { body } = require("express-validator");

exports.registerValidators = [
  body("email").isEmail().withMessage("Введите корректный емайл"),
  body("password", "Пароль должен быть не менее 6 символов")
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric(),
  body('confirm').custom((value, {req})=> {
if (value !== req.body.password) {
    throw new Error ("Пароли должны совпадать ")
}
return true
  }),
   body('name','Имя должно быть не менее 3 символов').isLength({min: 3}) 
];
