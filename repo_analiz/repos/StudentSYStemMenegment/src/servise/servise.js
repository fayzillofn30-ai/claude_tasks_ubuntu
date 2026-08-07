import Io from "../database/fileHelper.js";
let sxema = { id: 1, firstName: "Ali", lastName: "Valiyev", course: 2, faculty: "IT" }
/**
 * @function
 * @param {object} data 
 * @returns boolean
 */
function isvalid(data) {
    console.log(data)
    let keys = [...Object.keys(sxema)]
    console.log(keys)
    for(let key in data) {
        if(!keys.includes(key)) {
            return false
        }
        if(key == 'course' && (isNaN(+data[key])  || (+data[key] > 4 || +data[key] < 1))){
            return false
        }
        if((key == 'firstName' || key == 'lastName') && (!/^[a-zA-Z]+$/.test(data[key].trim()) || data[key].length < 3 || data[key] > 30) ) {
            return false
        }
        if(key == 'faculty' && (typeof data[key] !== 'string' || data[key].length < 2)) return false
    }
    return true
}

let servise = {
    /**
     * @function 
     * @param {response} res // express res object 
     * @returns 
     */
    getAll(res) {
        let students = Io.readFile()
        return res.status(200).send(students)
    },
    /**
     * @function 
     * @param {number} id 
     * @param {response} res // express response
     * @returns array  
     */
    getByI (id, res) {
        
        let student = Io.readFile().find(student => student.id == id)
        if(student) return res.status(200).send(student)

        res.status(404).send({
            message:"Student not found "
        });    
    },
    /**
     * @function // create student
     * @param {object} data  // {}
     * @param {response} res // express object response 
     * @returns //  response 
     */
    create (data, res) {

        data.id = Io.readFile().reduce((max, student) => max < student.id ? student.id : max, 0) + 1
        if(isvalid(data) && [...Object.keys(sxema)].length == 5) {
            data.course = parseInt(data.course)
            Io.updateFile(data)
            return res.status(201).send({message:"Student created !", data})
        }
        return res.status(400).send({message : "Student created error  ! "})
    },
    /**
     * @function // update  student
     * @param {object} data // student row 
     * @param {response} res // express response object  
     * @returns 
     */
    put (req, res) {
        let data = req.body
        data.id = parseInt(req.params.id || req.body.id)
        let oldata = {};
        let newData = {};
        if(isvalid(data) || data.id) {
            let stuidents = Io.readFile().map(student => {
                if(student.id == data.id){
                    oldata = student
                    newData = {...student,...data}
                    return newData
                }
                return student
            });
            Io.writeFile(stuidents)
            if(oldata.id){ 
                return res.status(200).send({
                    message:"Student updatetd sucses ! ",
                    oldata,
                    newData
                });
            }else{
                return res.status(404).send({
                    message:"Student not found ! "
                })
            }
        }else{
           return res.status(400).send({
            message:"Bad request ! "
           })  
        } 
    },
    /**
     * @function
     * @param {number} id // student id 
     * @param {response} res // express object response
     */
    delete (id, res) {
        console.log(id)
        let found = false
        let stuidents = Io.readFile().filter(stuendt => {
            if(stuendt.id !== parseInt(id)) return true
            else{
                found = true;
                return false
            }
        })
        if(found) {
            Io.writeFile(stuidents)
            res.status(200).send({
                message:"Student O'chirildi "
            })
        }else{
            res.status(404).send({
                message:"Student not found !"
            })
        }

    },
    filterByKey(data, res, key){
        let students = Io.readFile().filter(student => student[key] == data[key])
        return res.status(200).send(students)
    },
    sortByKey(key, res) {
        let data = Io.readFile()
        console.log(key)
        if(key == 'course'){
            let students = data.sort((a, b) => a[key] - b[key])
            return res.status(200).send(students)
        }else{
            let students = data.sort((a, b) => a[key].localeCompare(b[key]))
            return res.status(200).send(students)
        }
    },
    getQuery(req, res) {
        let query = req.query;
        let key = Object.keys(query)[0]
        query[key] = (key == 'course') ? +query[key] : query[key]
        if(key !=='sort') {
            this.filterByKey(query, res, key)
        }else{
            this.sortByKey(query[key], res)
        }
    }
}
export default servise