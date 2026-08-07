import { Router } from "express";
import Student from "../script/studentsController.js";
const router = Router()

router.get("/api/students", Student.getAll)
router.get('/api/students/:id', Student.getById)
router.post('/api/students', Student.createStudent)
router.put('/api/students/:id', Student.updateStudent)
router.delete('/api/students/:id',Student.deleteStudent)

export default router