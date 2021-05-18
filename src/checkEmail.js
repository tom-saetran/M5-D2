import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const checkmailRouter = express.Router()
export const checkMail = (email, location) => !!JSON.parse(fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), location))).find(author => author.email === email)
export default checkmailRouter.post("/", (req, res) => res.send(checkMail(req.body.email)))
