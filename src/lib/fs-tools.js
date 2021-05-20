import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const { readJSON, writeJSON, writeFile } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")
const uploadFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../../public/img/uploads")
const avatarsFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../../public/img/avatars")
const coversFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../../public/img/covers")
export const publicFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../../public")

export const readAuthors = async () => await readJSON(join(dataFolderPath, "authors.json"))
export const writeAuthors = async data => await writeJSON(join(dataFolderPath, "authors.json"), data)
export const writeAvatar = async (file, fileName) => await writeFile(join(avatarsFolderPath, fileName), file)

export const readBlogPosts = async () => await readJSON(join(dataFolderPath, "blogposts.json"))
export const writeBlogPosts = async data => await writeJSON(join(dataFolderPath, "blogposts.json"), data)
export const writeCover = async (file, fileName) => await writeFile(join(coversFolderPath, fileName), file)

export const writePicture = async (file, fileName) => await writeFile(join(uploadFolderPath, fileName), file)
