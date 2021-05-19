import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"
import createError from "http-errors"

const studentsRouter = express.Router()

const absoluteJSONPath = join(dirname(fileURLToPath(import.meta.url)), "students.json")
const relativeJSONPath = "/students/students.json"

studentsRouter.post("/", (req, res, next) => {
    try {
        const content = JSON.parse(fs.readFileSync(absoluteJSONPath))
        const newStudent = { ...req.body, createdAt: new Date(), id: uniqid() }
        content.push(newStudent)
        fs.writeFileSync(absoluteJSONPath, JSON.stringify(content))

        res.send(newStudent)
    } catch (error) {
        next(error)
    }
})

studentsRouter.get("/", (req, res, next) => {
    try {
        const content = JSON.parse(fs.readFileSync(absoluteJSONPath))
        res.send(content)
    } catch (error) {
        next(error)
    }
})

studentsRouter.get("/:id", (req, res, next) => {
    try {
        const content = JSON.parse(fs.readFileSync(absoluteJSONPath))
        const result = content.find(student => student.id === req.params.id)
        result ? res.send(result) : next(createError(404, `Student with id ${req.params.id} was not found`))
    } catch (error) {
        next(error)
    }
})

studentsRouter.put("/:id", (req, res, next) => {
    try {
        const content = JSON.parse(fs.readFileSync(absoluteJSONPath))
        let filtered = content.filter(student => student.id !== req.params.id)
        let me = content.find(student => student.id === req.params.id)
        me = { ...me, ...req.body }
        filtered.push(me)
        fs.writeFileSync(absoluteJSONPath, JSON.stringify(filtered))
        res.send(me)
    } catch (error) {
        next(error)
    }
})

studentsRouter.delete("/:id", (req, res, next) => {
    try {
        const content = JSON.parse(fs.readFileSync(absoluteJSONPath))
        const filtered = content.filter(student => student.id !== req.params.id)
        fs.writeFileSync(absoluteJSONPath, JSON.stringify(filtered))
        res.send("Deleted")
    } catch (error) {
        next(error)
    }
})

export default studentsRouter
