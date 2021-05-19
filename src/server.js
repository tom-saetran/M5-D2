import fs from "fs"
import cors from "cors"
import uniqid from "uniqid"
import express from "express"
import listEndpoints from "express-list-endpoints"

import { fileURLToPath } from "url"
import { dirname, join } from "path"

import studentsRouter from "./students/index.js"
import authorsRouter from "./authors/index.js"
import checkmailRouter from "./checkEmail.js"
import { badRequestHandler, defaultErrorHandler, notFoundHandler } from "./errorHandlers.js"
import blogPostsRouter from "./blogposts/index.js"

const server = express()
const port = 8888

server.use(cors())
server.use(express.json())

// ### Global Middlewares

const logger = (req, res, next) => {
    const content = JSON.parse(fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), "log.json")))
    content.push({
        _timeStamp: new Date(),
        method: req.method,
        resource: req.url,
        query: req.query,
        body: req.body,
        _id: uniqid()
    })

    fs.writeFileSync(join(dirname(fileURLToPath(import.meta.url)), "log.json"), JSON.stringify(content))
    next()
}
server.use(logger)

const auth = (req, res, next) => {
    console.log("Authorization Middleware")
    next()
}
server.use(auth)

// ### Routes

server.use("/authors", authorsRouter)
server.use("/students", studentsRouter)
server.use("/checkemail", checkmailRouter)
server.use("/blogposts", blogPostsRouter)

// ### Error Handlers

server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(defaultErrorHandler)

// ### Server Start

console.table(listEndpoints(server))
server.listen(port, () => {
    console.log("Server listening on port", port)
})
