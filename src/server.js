import fs from "fs-extra"
import cors from "cors"
import uniqid from "uniqid"
import express from "express"
import listEndpoints from "express-list-endpoints"

import { fileURLToPath } from "url"
import { dirname, join } from "path"

import authorsRouter from "./authors/index.js"
import { badRequestHandler, defaultErrorHandler, notFoundHandler } from "./errorHandlers.js"
import blogPostsRouter from "./blogposts/index.js"
import checkEmailRouter from "./checkEmail.js"
import { publicFolderPath } from "./lib/fs-tools.js"

const server = express()
const port = 8888

server.use(express.static(publicFolderPath))
server.use(cors())
server.use(express.json())

// ### Global Middlewares

const logger = async (req, res, next) => {
    const content = JSON.parse(fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), "log.json")))
    content.push({
        _timeStamp: new Date(),
        method: req.method,
        resource: req.url,
        query: req.query,
        body: req.body,
        _id: uniqid()
    })

    await fs.writeFile(join(dirname(fileURLToPath(import.meta.url)), "log.json"), JSON.stringify(content))
    next()
}
server.use(logger)

const auth = (req, res, next) => {
    //console.log("Authorization Middleware")
    next()
}
server.use(auth)

// ### Routes

server.use("/authors", authorsRouter)
server.use("/blogposts", blogPostsRouter)
server.use("/checkemail", checkEmailRouter)

// ### Error Handlers

server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(defaultErrorHandler)

// ### Server Start

console.table(listEndpoints(server))
server.listen(port, () => {
    console.log("Server listening on port", port)
})
