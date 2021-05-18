import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const checkmailRouter = express.Router()

const filePath = fileURLToPath(import.meta.url)
const checkmailFolderPath = dirname(filePath)
const checkmailJSONPath = join(checkmailFolderPath, "/authors/authors.json")
const content = JSON.parse(fs.readFileSync(checkmailJSONPath))

export const checkMail = email => !!content.find(author => author.email === email)
export default checkmailRouter.post("/", (req, res) => res.send(checkMail(req.body.email)))
