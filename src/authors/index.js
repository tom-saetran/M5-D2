import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"
import { checkMail } from "../checkEmail.js"

const authorRouter = express.Router()

const filePath = fileURLToPath(import.meta.url)
const folderPath = dirname(filePath)
const jsonPath = join(folderPath, "authors.json")

authorRouter.post("/", (req, res) => {
    const content = JSON.parse(fs.readFileSync(jsonPath))
    if (!checkMail(req.body.email)) {
        console.log(req.body.email)
        const newauthor = { ...req.body, createdAt: new Date(), id: uniqid() }
        content.push(newauthor)
        fs.writeFileSync(jsonPath, JSON.stringify(content))

        res.send(newauthor)
    } else {
        res.send("Email in use!")
    }
})

authorRouter.get("/", (req, res) => {
    const content = JSON.parse(fs.readFileSync(jsonPath))
    res.send(content)
})

authorRouter.get("/:id", (req, res) => {
    const content = JSON.parse(fs.readFileSync(jsonPath))
    const result = content.find(author => author.id === req.params.id)
    res.send(result)
})

authorRouter.put("/:id", (req, res) => {
    const content = JSON.parse(fs.readFileSync(jsonPath))
    let filtered = content.filter(author => author.id !== req.params.id)
    let me = content.find(author => author.id === req.params.id)
    me = { ...me, ...req.body }
    filtered.push(me)
    fs.writeFileSync(jsonPath, JSON.stringify(filtered))
    res.send(me)
})
authorRouter.delete("/:id", (req, res) => {
    const content = JSON.parse(fs.readFileSync(jsonPath))
    const filtered = content.filter(author => author.id !== req.params.id)
    fs.writeFileSync(jsonPath, JSON.stringify(filtered))
    res.send("Deleted")
})

export default authorRouter
