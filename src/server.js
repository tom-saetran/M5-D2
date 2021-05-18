import cors from "cors"
import express from "express"
import listEndpoints from "express-list-endpoints"
import studentsRouter from "./students/index.js"
import authorsRouter from "./authors/index.js"
import checkmailRouter from "./checkEmail.js"

const server = express()
const port = 8888

server.use(express.json())
server.use(cors())
server.use("/authors", authorsRouter)
server.use("/students", studentsRouter)
server.use("/checkEmail", checkmailRouter)

console.table(listEndpoints(server))

server.listen(port, () => {
    console.log("Server listening on port ", port)
})
