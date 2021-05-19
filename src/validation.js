import {body} from "express-validator"

export const authorSignUpValidation = [
    body("name").exists().withMessage("Name is missing"),
    body("surname").exists().withMessage("Surname is missing"),
    body("username").exists().withMessage("Username is missing"),
    body("password").exists().withMessage("Password is missing").isStrongPassword().withMessage("Password not strong enough"),
    body("email").exists().withMessage("Email is missing").isEmail().withMessage("Email is incorrect")
]