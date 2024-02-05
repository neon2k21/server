const Router = require('express')
const router = new Router()
const userController = require('../controller/user.controller')

router.post('/user', userController.createUser)
router.post('/getuser', userController.getUser)
router.get('/getmaster', userController.getMaster)
router.put('/user', userController.changeUserPassword)
router.delete('/user', userController.deleteUser)

module.exports = router

//10.10.0.58:8080/api/user