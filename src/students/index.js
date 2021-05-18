import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"

const studentsRouter = express.Router()

const studentJSONPath = join(dirname(fileURLToPath(import.meta.url)), "students.json")

studentsRouter.post("/", (req, res) => {
    const content = JSON.parse(fs.readFileSync(studentJSONPath))
    const newStudent = { ...req.body, createdAt: new Date(), id: uniqid() }
    content.push(newStudent)
    fs.writeFileSync(studentJSONPath, JSON.stringify(content))

    res.send(newStudent)
})

studentsRouter.get("/", (req, res) => {
    const content = JSON.parse(fs.readFileSync(studentJSONPath))
    res.send(content)
})

studentsRouter.get("/:id", (req, res) => {
    const content = JSON.parse(fs.readFileSync(studentJSONPath))
    const result = content.find(student => student.id === req.params.id)
    res.send(result)
})

studentsRouter.put("/:id", (req, res) => {
    const content = JSON.parse(fs.readFileSync(studentJSONPath))
    let filtered = content.filter(student => student.id !== req.params.id)
    let me = content.find(student => student.id === req.params.id)
    me = { ...me, ...req.body }
    filtered.push(me)
    fs.writeFileSync(studentJSONPath, JSON.stringify(filtered))
    res.send(me)
})
studentsRouter.delete("/:id", (req, res) => {
    const content = JSON.parse(fs.readFileSync(studentJSONPath))
    const filtered = content.filter(student => student.id !== req.params.id)
    fs.writeFileSync(studentJSONPath, JSON.stringify(filtered))
    res.send("Deleted")
})

export default studentsRouter
