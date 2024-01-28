const db = require('../config')
//`insert into times (time) values (to_timestamp(${Date.now()} / 1000.0))`
class TaskController{
    
    
    

    async createTask(req,res){
        var s = new Date(+start);
        var e = new Date(+end);
        s.setHours(12,0,0,0);
        e.setHours(12,0,0,0);
        var totalDays = Math.round((e - s) / 8.64e7);
        var wholeWeeks = totalDays / 7 | 0;
        var days = wholeWeeks * 5;
        if (totalDays % 7) {
            s.setDate(s.getDate() + wholeWeeks * 7);
            while (s < e) {
                s.setDate(s.getDate() + 1);
                if (s.getDay() != 0 && s.getDay() != 6) {
                    ++days;
                }
            }
        }

        var applicationDate = new Date(); // сегодняшняя дата
        var deadlineDate = new Date(applicationDate);
        deadlineDate.setDate(deadlineDate.getDate() + days);

        const {
            
          object,
          worker,
          task_stage,
          work_category,
          type_of_work, 
          description

        } = req.body

        const newTask = await db.query(
            `insert into tasks (  object, worker, task_stage, work_category, type_of_work, date_of_creation, date_of_deadline, description) 
            values ($1, $2, $3, $4, $5, to_timestamp($6 / 1000.0), to_timestamp($7 / 1000.0), $8 returning *`,
             [   object, worker, task_stage, work_category, type_of_work, Date.now(), deadlineDate, description]
        )
        res.json(newTask.rows[0])
    }   
    
    async getAllTasksForCurrentWorker(req,res){

        const newObject = await db.query(
            `select * from  tasks;`
        )
        res.json(newObject.rows[0])
        
    }

    async getAllTasks(req,res){
       

        const newObject = await db.query(
            `select * from  tasks;`,
        )
      

        
    var s = new Date(+start);
    var e = new Date(+end);
    s.setHours(12,0,0,0);
    e.setHours(12,0,0,0);
    var totalDays = Math.round((e - s) / 8.64e7);
    var wholeWeeks = totalDays / 7 | 0;
    var days = wholeWeeks * 5;
    if (totalDays % 7) {
        s.setDate(s.getDate() + wholeWeeks * 7);
        while (s < e) {
            s.setDate(s.getDate() + 1);
            if (s.getDay() != 0 && s.getDay() != 6) {
                ++days;
            }
        }
    }

    var applicationDate = new Date(); // сегодняшняя дата
    var deadlineDate = new Date(applicationDate);
    deadlineDate.setDate(deadlineDate.getDate() + calculateBusinessDays(newObject.rows[i+1].date_of_creation, newObject.rows[i+1].date_of_deadline));

    for(let i = 0; i < newObject.rowCount;i++ ){
        deadlineDate.setDate(deadlineDate.getDate() + calculateBusinessDays(applicationDate, deadlineDate));
        if (applicationDate > deadlineDate) {
            
            console.log("Дедлайн просрочен!");
            //6 росрочен
            const newObject = await db.query(
                `update tasks 
                set  stage = $1,
                where id = $2;`,
                [  6, id ]
            )
            res.json(newObject.rows[0])
        } else {
            console.log("Дедлайн: " + deadlineDate);
            res.json(newObject.rows[i])
        }
    }
  
    
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
            set  object = $1,
            set task_stage = $2,
            set work_category = $3,
            set type_of_work = $4,
            set description = $5
            where id = $6;`,
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

module.exports = new ObjectController()