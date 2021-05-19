import fs from "fs"
import uniqid from "uniqid"
import express from "express"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import createError from "http-errors"
import { validationResult } from "express-validator"
import { blogPostValidation } from "../validation.js"

const blogPostsRouter = express.Router()

const absoluteJSONPath = join(dirname(fileURLToPath(import.meta.url)), "blogposts.json")
const relativeJSONPath = "/blogposts/blogposts.json"

blogPostsRouter.post("/", blogPostValidation, (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            const content = JSON.parse(fs.readFileSync(absoluteJSONPath))
            const entry = { ...req.body, createdAt: new Date(), _id: uniqid() }
            content.push(entry)
            fs.writeFileSync(absoluteJSONPath, JSON.stringify(content))

            res.send(entry)
        } else {
            next(createError(400, [{ ...errors }]))
        }
    } catch (error) {
        next(error)
    }
})

blogPostsRouter.get("/", (req, res, next) => {
    try {
        const content = JSON.parse(fs.readFileSync(absoluteJSONPath))
        res.send(content)
    } catch (error) {
        next(error)
    }
})

blogPostsRouter.get("/:id", (req, res, next) => {
    try {
        const content = JSON.parse(fs.readFileSync(absoluteJSONPath))
        const result = content.find(item => item.id === req.params.id)
        result ? res.send(result) : next(createError(404, `Item with id ${req.params.id} was not found`))
    } catch (error) {
        next(error)
    }
})

blogPostsRouter.put("/:id", (req, res, next) => {
    try {
        const content = JSON.parse(fs.readFileSync(absoluteJSONPath))
        let filtered = content.filter(item => item.id !== req.params.id)
        let me = content.find(item => item.id === req.params.id)
        me = { ...me, ...req.body }
        filtered.push(me)
        fs.writeFileSync(absoluteJSONPath, JSON.stringify(filtered))
        res.send(me)
    } catch (error) {
        next(error)
    }
})
blogPostsRouter.delete("/:id", (req, res, next) => {
    try {
        const content = JSON.parse(fs.readFileSync(absoluteJSONPath))
        const filtered = content.filter(item => item.id !== req.params.id)
        fs.writeFileSync(absoluteJSONPath, JSON.stringify(filtered))
        res.send("Deleted")
    } catch (error) {
        next(error)
    }
})

export default blogPostsRouter
