import express from "express"
import { readAuthors } from "./lib/fs-tools.js"
import { join } from "path"
import { nextTick } from "process"

const checkmailRouter = express.Router()

export default checkmailRouter.post("/", async (req, res, next) => {
    try {
        const content = await readAuthors()
        const result = content.find(item => item.email === req.body.email)
        if (result) res.status(400).send("Email in use")
        else res.send("Not in use")
    } catch (error) {
        next(error)
    }
})
