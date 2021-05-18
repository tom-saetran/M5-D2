import express from "express"
import studentsRouter from "./students/index.js"
import listEndpoints from "express-list-endpoints"

const server = express()
const port = 8888

server.use(express.json())
server.use("/students", studentsRouter)

console.table(listEndpoints(server))

server.listen(port, () => {
    console.log("Server listening on port ", port)
})
