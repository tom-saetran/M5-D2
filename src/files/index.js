// upload
// multiupload
// download

import express from "express"
import multer from "multer"
import fs from "fs-extra"
import { pipeline } from "stream"
import { writePicture } from "../lib/fs-tools.js"

const filesRouter = express.Router()

filesRouter.post("/upload", multer().single("avatar"), async (req, res, next) => {
    try {
        console.log(req.file)
        await writePicture(req.file.buffer, req.file.originalname)

        res.send("yay")
    } catch (error) {
        next(error)
    }
})

filesRouter.post("/uploads", multer().array("avatar"), async (req, res, next) => {
    try {
        const arrayOfPromises = req.files.map(file => {
            console.log(file)
            writePicture(file.buffer, file.originalname)
        })
        await Promise.all(arrayOfPromises)
        res.send("OK")
    } catch (error) {
        next(error)
    }
})

filesRouter.get("/download/:id", async (req, res, next) => {
    try {
        // STREAMS!
        // different types, readable (src), writeable (dest)
        const source = fs.createReadStream("path")

        res.setHeader("Content-Disposition", `attachment; filename=test.gif`)
        const destination = res
        pipeline(source, destination, err => next(err))
    } catch (error) {
        next(error)
    }
})

export default filesRouter
