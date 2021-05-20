import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const { readJSON, writeJSON, writeFile } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")
const uploadFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../../public/img/uploads")

export const readBooks = async () => await readJSON(join(dataFolderPath, "books.json"))

export const readBlogPosts = async () => await readJSON(join(dataFolderPath, "blogposts.json"))
export const writeBlogPosts = async data => await writeJSON(join(dataFolderPath, "blogposts.json"), data)

export const writePicture = async (file, fileName) => await writeFile(join(uploadFolderPath, fileName), file)
