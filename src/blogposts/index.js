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
            next(createError(400, JSON.stringify(errors.errors)))
        }
    } catch (error) {
        next(error)
    }
})

blogPostsRouter.get("/", (req, res, next) => {
    try {
        const content = JSON.parse(fs.readFileSync(absoluteJSONPath))
        if (req.query.title !== undefined) res.send(content.filter(item => item.title.toLowerCase().includes(req.query.title.toLowerCase())))
        res.send(content)
    } catch (error) {
        next(error)
    }
})

blogPostsRouter.get("/:id", (req, res, next) => {
    try {
        const content = JSON.parse(fs.readFileSync(absoluteJSONPath))
        const result = content.find(item => item._id === req.params.id)
        result ? res.send(result) : next(createError(404, `Item with id ${req.params.id} was not found`))
    } catch (error) {
        next(error)
    }
})

blogPostsRouter.put("/:id", blogPostValidation, (req, res, next) => {
    try {
        const content = JSON.parse(fs.readFileSync(absoluteJSONPath))
        const filtered = content.filter(item => item._id !== req.params.id)
        let me = content.find(item => item._id === req.params.id)
        if (!me) next(createError(404, `Item with id ${req.params.id} was not found`))
        me = { ...me, ...req.body }
        filtered.push(me)
        const errors = validationResult(filtered)
        if (!errors.isEmpty()) next(createError(400, JSON.stringify(errors.errors)))
        fs.writeFileSync(absoluteJSONPath, JSON.stringify(filtered))
        res.send(me)
    } catch (error) {
        next(error)
    }
})

blogPostsRouter.delete("/:id", (req, res, next) => {
    try {
        const content = JSON.parse(fs.readFileSync(absoluteJSONPath))
        const filtered = content.find(item => item._id === req.params.id)
        if (!filtered) res.status(400).send("id does not match")
        fs.writeFileSync(absoluteJSONPath, JSON.stringify(filtered))
        res.send("Deleted")
    } catch (error) {
        next(error)
    }
})

export default blogPostsRouter
