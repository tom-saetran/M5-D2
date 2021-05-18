import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"

const studentsRouter = express.Router()

const filePath = fileURLToPath(import.meta.url)
const studentFolderPath = dirname(filePath)
const studentJSONPath = join(studentFolderPath, "students.json")
const content = JSON.parse(fs.readFileSync(studentJSONPath))

studentsRouter.post("/", (req, res) => {
    const newStudent = { ...req.body, createdAt: new Date(), id: uniqid() }
    content.push(newStudent)
    fs.writeFileSync(studentJSONPath, JSON.stringify(content))

    res.send(newStudent)
})

studentsRouter.get("/", (req, res) => {
    console.log(req.headers)
    res.send(content)
})

studentsRouter.get("/:id", (req, res) => {
    const result = content.find(student => student.id === req.params.id)
    res.send(result)
})

studentsRouter.put("/:id", (req, res) => {
    let me = []
    let notMe = []
    content.find(item => (item.id === req.params.id ? me.push(item) : notMe.push(item)))
    console.log()

    let filtered = content.filter(student => student.id !== req.params.id)
    let me = content.find(student => student.id === req.params.id)
    me = { ...me, ...req.body }
    filtered.push(me)
    fs.writeFileSync(studentJSONPath, JSON.stringify(filtered))
    res.send(me)
})
studentsRouter.delete("/:id", (req, res) => {
    const filtered = content.filter(student => student.id !== req.params.id)
    fs.writeFileSync(studentJSONPath, JSON.stringify(filtered))
    res.send("Deleted")
})

export default studentsRouter
