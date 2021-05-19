import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"
import createError from "http-errors"

const blogPostsRouter = express.Router()

const absoluteJSONPath = join(dirname(fileURLToPath(import.meta.url)), "blogposts.json")
const relativeJSONPath = "/blogposts/blogposts.json"

blogPostsRouter.post("/", (req, res, next) => {
    try {
        const content = JSON.parse(fs.readFileSync(absoluteJSONPath))
        const entry = { ...req.body, createdAt: new Date(), id: uniqid() }
        content.push(entry)
        fs.writeFileSync(absoluteJSONPath, JSON.stringify(content))

        res.send(entry)
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
