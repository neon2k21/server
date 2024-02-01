const Router = require('express')
const router = new Router()
const taskController = require('../controller/task.controller')


router.post('/task', taskController.createTask)
router.post('/gettasks', taskController.getAllTasksForUser)
router.get('/task', taskController.getAllTasks)
router.put('/task', taskController.updateTasks)
router.delete('/task', taskController.deleteTasks)





module.exports = router