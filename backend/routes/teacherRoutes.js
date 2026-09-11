const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/rtoTeacherController');

router.get('/', teacherController.getTeachers);
router.post('/', teacherController.createTeacher);
router.put('/:id', teacherController.updateTeacher);
router.delete('/:id', teacherController.deleteTeacher);

module.exports = router;