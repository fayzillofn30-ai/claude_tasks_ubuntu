// Servise student
import servise from "../servise/servise.js"

// Studens Menegmentsystem
/**
 * @object
 *  // Students Controller
 * @example 
 *  // Student.getAll(req, res)  ---> return All students
 *  // Bu object studentlarning ma'lumotlarini qayta ishlash 
 *  // Student qo'shish 
 *  // Studentni basadan o'chirish bilan shug'ulanadi
 */
let Student = {
    /***
     * @function
     * @param {request} req  // express serverga kelgan request
     * @param {response} res // express serverdan olingan response objecti
     * @example 
     *  Student.getById( req, res)
     */
    info () {
        console.log(this)
        return this
    },
    getById(req, res) {
        console.log(req.params.id)
        servise.getByI(req.params.id, res)
    },
    /***
     * @function
     * @param {request} req  // express serverga kelgan request
     * @param {response} res // express serverdan olingan response objecti
     * @example 
     *  Student.getAll( req, res)
     */
    getAll(req, res) {
        if(!req.query) servise.getAll(res);
        else servise.getQuery(req, res)
    },
        /***
     * @function
     * @param {request} req  // express serverga kelgan request
     * @param {response} res // express serverdan olingan response objecti
     * @example 
     *  Student.createStudent( req, res)
     */
    createStudent (req, res) {
        servise.create(req.body, res)
    },
        /***
     * @function
     * @param {request} req  // express serverga kelgan request
     * @param {response} res // express serverdan olingan response objecti
     * @example 
     *  Student.updateStudent( req, res)
     */
    updateStudent (req, res) {
        servise.put(req , res)
    },
    /***
     * @function
     * @param {request} req  // express serverga kelgan request
     * @param {response} res // express serverdan olingan response objecti
     * @example 
     *  Student.deleteStudent( req, res)
     */
    deleteStudent (req, res) {
        servise.delete(req.params.id, res)
    },
    sortedCourse(req, res) {
        console.log(req.query)    
        res.send("sorted")
        // servise.sortByCourse(4, res)
    }
}
export default Student