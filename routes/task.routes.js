const Router = require('express')
const router = new Router()
const taskController = require('../controller/task.controller')


router.post('/task', taskController.createTask)
router.post('/getUsertask', taskController.getAllTasksForUser)
router.post('/getAdmintask', taskController.getAllForAdminTasks)
router.post('/getMastertask', taskController.getAllForMasterTasks)
router.put('/task', taskController.updateTasks)
router.delete('/task', taskController.deleteTasks)





module.exports = router