import path from "path"
import uniqid from "uniqid"
import multer from "multer"
import express from "express"
import createError from "http-errors"
import { validationResult } from "express-validator"
import { authorSignUpValidationNoAvatar } from "../validation.js"
import { readAuthors, writeAuthors, writeAvatar } from "../lib/fs-tools.js"

const authorRouter = express.Router()

authorRouter.post("/", authorSignUpValidationNoAvatar, async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            const content = await readAuthors()
            const result = content.find(item => item.email === req.body.email)
            if (result) next(createError(400, "Email in use"))
            else {
                const newauthor = { ...req.body, _createdAt: new Date(), _id: uniqid() }
                content.push(newauthor)
                writeAuthors(content)
                res.send(newauthor)
            }
        } else {
            next(createError(400, JSON.stringify(errors.errors)))
        }
    } catch (error) {
        next(error)
    }
})

authorRouter.post("/:id/uploadAvatar", multer().single("avatar"), async (req, res, next) => {
    try {
        const content = await readAuthors()
        const result = content.filter(author => author._id !== req.params.id)
        let me = content.find(author => author._id === req.params.id)
        if (!me) next(createError(400, "id does not match"))
        await writeAvatar(req.file.buffer, req.params.id + path.extname(req.file.originalname))
        me = { ...me, avatar: `${req.protocol}://${req.get("host")}/img/avatars/${req.params.id}${path.extname(req.file.originalname)}` }
        result.push(me)
        writeAuthors(result)
        res.status(201).send("Added")
    } catch (error) {
        next(error)
    }
})

authorRouter.get("/", async (req, res) => {
    const content = await readAuthors()
    res.send(content)
})

authorRouter.get("/:id", async (req, res) => {
    const content = await readAuthors()
    const result = content.find(author => author._id === req.params.id)
    res.send(result)
})

authorRouter.put("/:id", authorSignUpValidationNoAvatar, async (req, res) => {
    const content = await readAuthors()
    const result = content.filter(author => author._id !== req.params.id)
    let me = content.find(author => author._id === req.params.id)
    me = { ...me, ...req.body }
    const errors = validationResult(me)
    if (errors.isEmpty()) {
        result.push(me)
        writeAuthors(result)
        res.send(me)
    } else {
        next(createError(400, [{ ...errors.errors }]))
    }
})

authorRouter.delete("/:id", async (req, res) => {
    const content = await readAuthors()
    const result = content.filter(author => author._id !== req.params.id)
    writeAuthors(result)
    res.send("Deleted")
})

export default authorRouter
