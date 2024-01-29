const Router = require('express')
const router = new Router()
const userController = require('../controller/user.controller')

router.post('/user', userController.createUser)
router.get('/user', userController.getIDForUser)
router.put('/user', userController.changeUserPassword)
router.delete('/user', userController.deleteUser)

module.exports = router