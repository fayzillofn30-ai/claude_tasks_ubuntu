import path from "path";
import fs from "fs";

export default function getPath(filename) {
    const fullPath = path.join(process.cwd(),"src", "utils","resurs","uploads")
    const filePath = path.join(fullPath,filename)
    console.log(fullPath)
    if(!fs.existsSync(fullPath)){
        fs.mkdirSync(fullPath,{recursive:true})
    }
    return filePath
}