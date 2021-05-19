import {body} from "express-validator"

export const authorSignUpValidation = [
    body("name").exists().withMessage("Name is missing"),
    body("surname").exists().withMessage("Surname is missing"),
    body("username").exists().withMessage("Username is missing"),
    body("password").exists().withMessage("Password is missing").isStrongPassword().withMessage("Password not strong enough"),
    body("email").exists().withMessage("Email is missing").normalizeEmail().isEmail().withMessage("Email is incorrect")
]

export const blogPostValidation = [
    body("category").exists().withMessage("Category is missing"),
    body("title").exists().withMessage("Title is missing"),
    body("cover").exists().withMessage("Cover is missing"),

    body("readTime").exists().withMessage("Read time object is missing").isObject().withMessage("Read time must be an object"),
    body("readTime.value").exists().withMessage("Read time value is missing").isInt().withMessage("Read time value must be a number"),
    body("readTime.unit").exists().withMessage("Read time unit is missing"),

    body("author").exists().withMessage("Author object is missing").isObject().withMessage("Author must be an object"),
    body("author.name").exists().withMessage("Author name is missing"),
    body("author.avatar").exists().withMessage("Author avatar is missing"),
    
    body("content").exists().withMessage("Content is missing")
]