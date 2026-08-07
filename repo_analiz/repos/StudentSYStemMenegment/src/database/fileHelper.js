import fs from "fs";
import path from "path"

let Io = {
    /**
     * @property
     *  // file manzili
     */
    root:path.join(process.cwd(),"src","database","students.json"),
    /**
     * @function
     * @returns Array or false
     * @example
     * const students = Io.readFile()
     */
    readFile () {
        try {
            return JSON.parse(fs.readFileSync(this.root, 'utf-8'))
        } catch (error) {
            return false            
        }
    },
    /**
     * @function
     * @returns true or false
     * @example 
     * @param {Array}
     * @example
     *  const status = Io.writeFile(data)
     */
    writeFile (data) {
        try {
            console.log(this.root)
            fs.writeFileSync(this.root,JSON.stringify(data,null,4))
            return true
        } catch (error) {
            return false            
        }
    },
    /**
     * @function
     * @function
     * @param {Array} data
     * @returns true or false  
     */
    updateFile (data) {
        try {
            let oldData = this.readFile()
            oldData.push(data)
            this.writeFile(oldData)
            return true
        } catch (error) {
            return false;            
        }
    }
}  

export default Io
