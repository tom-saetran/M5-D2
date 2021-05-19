import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"
import { checkMail } from "../checkEmail.js"
import { authorSignUpValidation } from "../validation.js"
import { validationResult } from "express-validator"
import createError from "http-errors"

const authorRouter = express.Router()

const absoluteJSONPath = join(dirname(fileURLToPath(import.meta.url)), "authors.json")
const relativeJSONPath = "/authors/authors.json"

authorRouter.post("/", authorSignUpValidation, (req, res, next) => {
    const errors = validationResult(req)

    if (errors.isEmpty()) {
        const content = JSON.parse(fs.readFileSync(absoluteJSONPath))
        if (!checkMail(req.body.email, relativeJSONPath)) {
            const newauthor = { ...req.body, createdAt: new Date(), id: uniqid() }
            content.push(newauthor)
            fs.writeFileSync(absoluteJSONPath, JSON.stringify(content))

            res.send(newauthor)
        } else {
            res.status(400).send("Email in use!")
        }
    } else {
        next(createError(400, [{ ...errors }]))
    }
})

authorRouter.get("/", (req, res) => {
    const content = JSON.parse(fs.readFileSync(absoluteJSONPath))
    res.send(content)
})

authorRouter.get("/:id", (req, res) => {
    const content = JSON.parse(fs.readFileSync(absoluteJSONPath))
    const result = content.find(author => author.id === req.params.id)
    res.send(result)
})

authorRouter.put("/:id", (req, res) => {
    const content = JSON.parse(fs.readFileSync(absoluteJSONPath))
    let filtered = content.filter(author => author.id !== req.params.id)
    let me = content.find(author => author.id === req.params.id)
    me = { ...me, ...req.body }
    filtered.push(me)
    fs.writeFileSync(absoluteJSONPath, JSON.stringify(filtered))
    res.send(me)
})

authorRouter.delete("/:id", (req, res) => {
    const content = JSON.parse(fs.readFileSync(absoluteJSONPath))
    const filtered = content.filter(author => author.id !== req.params.id)
    fs.writeFileSync(absoluteJSONPath, JSON.stringify(filtered))
    res.send("Deleted")
})

export default authorRouter
