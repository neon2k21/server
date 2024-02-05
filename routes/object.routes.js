const Router = require('express')
const router = new Router()
const objectController = require('../controller/object.controller')


router.post('/object', objectController.createObject)
router.get('/object', objectController.getAllObjects)
router.post('/get_object', objectController.getAllObjectsForCurrentUser)
router.post('/get_object_owner', objectController.getAllObjectsByOwner)
router.post('/get_object_category', objectController.getAllObjectsByCategory)
router.post('/get_object_owner_category', objectController.getAllObjectsByCategoryAndOwner)
router.post('/get_selected_object', objectController.getSelectedObjectsForCurrentUser)
router.put('/object', objectController.updateObject)
router.delete('/object', objectController.deleteObject)


module.exports = router