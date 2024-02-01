const db = require('../config')
//`insert into times (time) values (to_timestamp(${Date.now()} / 1000.0))`
class TaskController{
    
    
    

    async createTask(req,res){
        const currentDateTime = Date.now();
        const postgresqlDate = convertToPostgreSQLDate(currentDateTime);
        console.log("Дата в формате PostgreSQL:", postgresqlDate);


        const dateReceived = Date.now();
        const receivedDate = new Date(dateReceived);


        // Добавление 3 дней к дате получения заявки
        const deadlineDate = new Date(receivedDate.getTime() + (3 * 24 * 60 * 60 * 1000));
        
        // Проверка, если дедлайн выпадает на выходной, то сдвигаем его до понедельника
        if (deadlineDate.getDay() === 0) { // Воскресенье
            deadlineDate.setDate(deadlineDate.getDate() + 1); // Сдвигаем на понедельник
        } else if (deadlineDate.getDay() === 6) { // Суббота
            deadlineDate.setDate(deadlineDate.getDate() + 2); // Сдвигаем на понедельник
        }
        
        // Проверка на просроченный дедлайн
        
        
        const data_for_deadline = deadlineDate.toDateString();
        



        const {
            
          object,
          work_category,
          type_of_work, 
          description

        } = req.body

        const getTotalInfo = await db.query(
            `SELECT 
                obj.id,
                obj.category,
                obj.image,
                cat.master
         FROM 
             object obj
         JOIN 
             object_category cat ON obj.category = cat.id
            WHERE obj.id=$1`, [object]
        )
        const newTask = await db.query(
            `insert into tasks (  object, worker, task_stage, work_category, type_of_work, date_of_creation, date_of_deadline, description, image) 
            values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *`,
             [   object, getTotalInfo.rows[0].master, 1, work_category, type_of_work, postgresqlDate, data_for_deadline, description, getTotalInfo.rows[0].image]
        )
        res.json(newTask.rows[0])
    }   
    
    async getAllForAdminTasks(req,res){   
        checkStage()
        const newObject = await db.query(
            `SELECT t.id, t.task_stage, t.work_category, t.type_of_work, t.date_of_creation, t.date_of_deadline, t.description, t.image, 
            o.name, o.address, o.inn, o.contact, o.category, 
            oc.master,
           u.fio, u.login, u.password, u.role, u.phone
            FROM tasks t
            INNER JOIN object o ON t.object = o.id
            INNER JOIN object_category oc ON o.category = oc.id
            INNER JOIN users u ON t.worker = u.id;`)
         res.json(newObject.rows)
    }

    async getAllForMasterTasks(req,res){   
        checkStage()
        const {id} = req.body;
        const newObject = await db.query(
            `SELECT t.id, t.task_stage, t.work_category, t.type_of_work, t.date_of_creation, t.date_of_deadline, t.description, t.image, 
            o.name, o.address, o.inn, o.contact, o.category, 
            oc.master,
           u.fio, u.login, u.password, u.role, u.phone
            FROM tasks t
            INNER JOIN object o ON t.object = o.id
            INNER JOIN object_category oc ON o.category = oc.id
            INNER JOIN users u ON t.worker = u.id
            where oc.master = $1;`, [id])
         res.json(newObject.rows)
    }


    async getAllTasksForUser(req,res){   

        const {id} = req.body;
        checkStage()

        const newObject = await db.query(
            `SELECT 
            t.id AS task_id,
            t.object AS object_id,
            o.name AS object_name,
            o.address AS object_address,
            o.inn AS object_inn,
            o.contact AS object_contact,
            o.category AS object_category,
            o.image AS object_image,
            u.id AS user_id,
            u.fio AS user_fio,
            u.login AS user_login,
            u.password AS user_password,
            u.role AS user_role,
            u.phone AS user_phone,
            t.worker,
            t.task_stage,
            t.work_category,
            t.type_of_work,
            t.date_of_creation,
            t.date_of_deadline,
            t.description
        FROM 
            tasks t
        JOIN 
            object o ON t.object = o.id
        JOIN 
            users u ON o.contact = u.id
        where u.id = $1;
        `,[id]
        )
         res.json(newObject.rows)
    }



    async updateTasks(req,res){
        const {     object,
                    worker,
                    task_stage,
                    work_category,
                    type_of_work, 
                    description,
                    id } = req.body
      
        const newObject = await db.query(
            `update tasks 
           set object = $1,
           worker = $2,
            task_stage = $3,
            work_category = $4,
            type_of_work = $5,
            description = $6
            where id = $7;`,
            [    object,
                worker,
                task_stage,
                work_category,
                type_of_work, 
                description,
                id
            ]
        )
        res.json(newObject.rows[0])
    }

    async deleteTasks(req,res){
        const { id } = req.body
      
        await db.query(
            `delete from tasks where id = $1;`, [ id]
        )
        res.json('deleted')
    }

}
function convertToPostgreSQLDate(date) {
    // Преобразование даты в объект Date
    const jsDate = new Date(date);
    
    // Получение года, месяца и дня
    const year = jsDate.getFullYear();
    const month = (jsDate.getMonth() + 1).toString().padStart(2, '0'); // добавляем ведущий ноль, если месяц состоит из одной цифры
    const day = jsDate.getDate().toString().padStart(2, '0'); // добавляем ведущий ноль, если день состоит из одной цифры
    
    // Формирование строки в формате PostgreSQL
    const postgresqlDate = `${year}-${month}-${day}`;
    
    return postgresqlDate;
}

async function checkStage(){
    const newObject = await db.query('select * from tasks;')
    for(let i = 0; i < newObject.rowCount;i++){
        const daysDifference = Math.floor((newObject.rows[i].date_of_creation - newObject.rows[i].date_of_deadline) / (1000 * 60 * 60 * 24));
        if(daysDifference > 1 && newObject.rows[i].task_stage < 6){
        await db.query(`update tasks set task_stage = $1 where id = $2;`, [ 6, newObject.rows[i].id ])
        }
     }
}


module.exports = new TaskController()