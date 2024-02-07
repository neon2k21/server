const Router = require('express')
const router = new Router()
const taskController = require('../controller/task.controller')


router.post('/task', taskController.createTask)
router.post('/getUserObjecttask', taskController.getAllTasksForUser)
router.post('/getAdmintask', taskController.getAllForAdminTasks)
router.post('/getMastertask', taskController.getAllForMasterTasks)

router.post('/getMastertaskByStageAndObject', taskController.getAllForMasterTasksByObjectAndStage)
router.post('/getTaskByID', taskController.getTaskByID)
router.put('/task_admin', taskController.updateTasks)
router.put('/task_master', taskController.MasterUpdateTasks)
router.put('/task_cancel', taskController.CancelTasks)
router.put('/task_accept', taskController.AcceptTasks)
router.put('/task_user', taskController.updateDescTasks)
router.delete('/task', taskController.deleteTasks)





module.exports = router