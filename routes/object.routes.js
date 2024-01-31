const Router = require('express')
const router = new Router()
const objectController = require('../controller/object.controller')


router.post('/object', objectController.createObject)
router.get('/object', objectController.getAllObjects)
router.post('/get_object', objectController.getAllObjectsForCurrentUser)
router.put('/object', objectController.updateObject)
router.delete('/object', objectController.deleteObject)





module.exports = router