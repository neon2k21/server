const express = require('express')
const userRouter = require('./routes/user.routes')
const objectRouter = require('./routes/object.routes')
const taskRouter = require('./routes/task.routes')

const PORT = process.env.PORT || 8080

const app = express()

app.use(express.json())
app.use('/api',userRouter)
app.use('/api',objectRouter)
app.use('/api',taskRouter)









app.listen(PORT, () => console.log(`Сервер запущен с портом: ${PORT}`))


