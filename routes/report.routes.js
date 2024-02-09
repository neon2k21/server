const Router = require('express')
const router = new Router()
const reportController = require('../controller/report.controller')

router.get('/report/1', reportController.getReport1)
router.get('/report/2', reportController.getReport2)
router.get('/report/3', reportController.getReport3)
router.get('/report/4', reportController.getReport4)


module.exports = router