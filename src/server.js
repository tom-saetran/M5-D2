import express from "express"

const server = express()
const port = 8888
server.listen(port, () => {
    console.log("Server listening on port ", port)
})
