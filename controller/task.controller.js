const db = require('../config')
const { format, addDays, isWeekend, differenceInDays, parse } = require('date-fns');


class TaskController{
    

    async createTask(req,res){
      
        // 1) Получаем актуальную дату и конвертируем ее в строку
        const today = new Date();
        const formattedToday = format(today, 'yyyy-MM-dd');

        // 2) Устанавливаем дедлайн через 3 рабочих дня, игнорируя выходные
        let deadline = addDays(today, 3);
        while (isWeekend(deadline)) {
            deadline = addDays(deadline, 1);
        }

        // 3) Конвертируем дедлайн из строки в дату и проверяем на просрочку
        const formattedDeadline = format(deadline, 'yyyy-MM-dd');
       

       
        const { object, work_category, type_of_work, description} = req.body
              
       const sql1_result = await getInfoForCreate(db,object)
        console.log(sql1_result)


        const sql2 = (
        `insert into tasks (  object, worker, task_stage, work_category, type_of_work, date_of_creation, date_of_deadline, description, image) 
        values (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        db.all(sql2,[
            object, sql1_result.master, 1, work_category, type_of_work,
            formattedToday, formattedDeadline, description,sql1_result.image
                    ], (err,rows) => {
            if (err) return res.json(err)
            else return res.json(rows)
        })
    }   
    
    async getAllForAdminTasks(req,res){ 
       checkStage()
        const { object } = req.body
        const sql = (
            `SELECT 
            t.id AS task_id,
            t.object AS object_id,
            o.name AS object_name,
            o.address AS object_address,
            o.inn AS object_inn,
            o.contact AS object_contact,
            oc.category AS object_category,
            oc.master AS object_category_master,
            o.image AS object_image,
            t.worker,
			ts.id AS task_stage_id,
            ts.stage AS task_stage,
            t.work_category as work_category_id,
			wc.name as work_category_name,
            t.type_of_work as type_of_work_id,
			tw.type as type_of_work_id,
            t.date_of_creation,
            t.date_of_deadline,
            t.description,
            u.id AS user_id,
            u.fio AS user_fio,
            u.phone AS user_phone
        FROM 
            tasks t
        JOIN 
            object o ON t.object = o.id
		JOIN 
            object_category oc ON o.category = oc.id
        JOIN 
            type_of_work tw ON t.type_of_work = tw.id
        JOIN 
            work_category wc ON t.work_category = wc.id
        JOIN 
            task_stage ts ON t.task_stage = ts.id
        JOIN 
            users u ON o.contact = u.id
        WHERE t.object=?
        ORDER BY 
            ts.id ASC;`
        )
       
        db.all(sql,[object], (err,rows) => {
            if (err) return res.json(err)
            else return res.json(rows)
        })

  
       
    }

    async getAllForMasterTasks(req,res){   
        checkStage()
        const {id} = req.body;
        const sql = (
            `SELECT 
            t.id AS task_id,
            t.object AS object_id,
            o.name AS object_name,
            o.address AS object_address,
            o.inn AS object_inn,
            o.contact AS object_contact,
            oc.category AS object_category,
            oc.master AS object_category_master,
            o.image AS object_image,
            t.worker,
			ts.id AS task_stage_id,
            ts.stage AS task_stage,
            t.work_category as work_category_id,
			wc.name as work_category_name,
            t.type_of_work as type_of_work_id,
			tw.type as type_of_work_name,
            t.date_of_creation,
            t.date_of_deadline,
            t.description,
            u.id AS user_id,
            u.fio AS user_fio,
            u.phone AS user_phone
        FROM 
            tasks t
        JOIN 
            object o ON t.object = o.id
		JOIN 
            object_category oc ON o.category = oc.id
        JOIN 
            type_of_work tw ON t.type_of_work = tw.id
        JOIN 
            work_category wc ON t.work_category = wc.id
        JOIN 
            task_stage ts ON t.task_stage = ts.id
        JOIN 
            users u ON o.contact = u.id              
        where oc.master = ?  AND (ts.id = 1 or ts.id = 2 or ts.id = 4 or ts.id = 5)
        ORDER BY 
        ts.id ASC;`)
        
        db.all(sql,[id], (err,rows) => {
            if (err) return res.json(err)
            else return res.json(rows)
    }) 
    }


    async getAllForMasterTasksByObjectAndStage(req,res){   
        checkStage()
        const {id_object, id_stage} = req.body;
        const sql = (
            `SELECT 
            t.id AS task_id,
            t.object AS object_id,
            o.name AS object_name,
            o.address AS object_address,
            o.inn AS object_inn,
            o.contact AS object_contact,
            oc.category AS object_category,
            oc.master AS object_category_master,
            o.image AS object_image,
            t.worker,
			ts.id AS task_stage_id,
            ts.stage AS task_stage,
            t.work_category as work_category_id,
			wc.name as work_category_name,
            t.type_of_work as type_of_work_id,
			tw.type as type_of_work_name,
            t.date_of_creation,
            t.date_of_deadline,
            t.description,
            u.id AS user_id,
            u.fio AS user_fio,
            u.phone AS user_phone
        FROM 
            tasks t
        JOIN 
            object o ON t.object = o.id
		JOIN 
            object_category oc ON o.category = oc.id
        JOIN 
            type_of_work tw ON t.type_of_work = tw.id
        JOIN 
            work_category wc ON t.work_category = wc.id
        JOIN 
            task_stage ts ON t.task_stage = ts.id
        JOIN 
            users u ON o.contact = u.id              
        where  t.object = ? and ts.id = ?`)
        
        db.all(sql,[id_object, id_stage], (err,rows) => {
            if (err) return res.json(err)
            else return res.json(rows)
    }) 
    }

  


    async getTaskByID(req,res){   
        const {id} = req.body;
        const sql = (
            `SELECT 
            t.id AS task_id,
            t.object AS object_id,
            o.name AS object_name,
            o.address AS object_address,
            o.inn AS object_inn,
            o.contact AS object_contact,
            oc.category AS object_category,
            oc.master AS object_category_master,
            o.image AS object_image,
            t.worker,
            ts.id AS task_stage_id,
            ts.stage AS task_stage,
            t.work_category,
            t.type_of_work,
            t.date_of_deadline,
            t.description,
            u.fio AS user_fio,
            u.phone AS user_phone
        FROM 
            tasks t
        JOIN 
            object o ON t.object = o.id
        JOIN 
            object_category oc ON o.category = oc.id
        JOIN 
            task_stage ts ON t.task_stage = ts.id
        JOIN 
            users u ON o.contact = u.id               
        where  t.id = ?
        ORDER BY 
            ts.id ASC;`)
        
        db.all(sql,[id], (err,rows) => {
            if (err) return res.json(err)
            else return res.json(rows)
    }) 
    }

    async getAllTasksForUser(req,res){   
        checkStage()
        const {id, object} = req.body;

        const sql = (
            `SELECT 
            t.id AS task_id,
            t.object AS object_id,
            o.name AS object_name,
            o.address AS object_address,
            o.inn AS object_inn,
            o.contact AS object_contact,
            oc.category AS object_category,
            oc.master AS object_category_master,
            o.image AS object_image,
            t.worker,
			ts.id AS task_stage_id,
            ts.stage AS task_stage,
            t.work_category as work_category_id,
			wc.name as work_category_name,
            t.type_of_work as type_of_work_id,
			tw.type as type_of_work_id,
            t.date_of_creation,
            t.date_of_deadline,
            t.description,
            u.id AS user_id,
            u.fio AS user_fio,
            u.phone AS user_phone
        FROM 
            tasks t
        JOIN 
            object o ON t.object = o.id
		JOIN 
            object_category oc ON o.category = oc.id
        JOIN 
            type_of_work tw ON t.type_of_work = tw.id
        JOIN 
            work_category wc ON t.work_category = wc.id
        JOIN 
            task_stage ts ON t.task_stage = ts.id
        JOIN 
            users u ON o.contact = u.id        
        where u.id = ? AND t.object = ?
        ORDER BY 
            ts.id ASC;`)
            db.all(sql,[id, object], (err,rows) => {
            if (err) return res.json(err)
            else return res.json(rows)
    })
    }

    async CancelTasks(req,res){

        const {id} = req.body
        const sql = (
            `update tasks 
            set 
             task_stage = 3
             where id = ?;`
        )
        db.all(sql,[id], (err,rows) => {
            if (err) return res.json(err)
            else return res.json(rows)
    })
        
    }

    async AcceptTasks(req,res){

        const {id} = req.body
        const sql = (
            `update tasks 
            set 
             task_stage = 5
             where id = ?;`
        )
        db.all(sql,[id], (err,rows) => {
            if (err) return res.json(err)
            else return res.json(rows)
    })
        
    }

    async updateDescTasks(req,res){

        const { description, id} = req.body
        const sql = (
            `update tasks 
            set 
             description = ?
             where id = ?;`
        )
        db.all(sql,[description, id], (err,rows) => {
            if (err) return res.json(err)
            else return res.json(rows)
    })
        
    }

    async updateTasks(req,res){

        const { worker, task_stage, work_category, type_of_work, description, id} = req.body
        const sql = (
            `update tasks 
            set 
            worker = ?,
             task_stage = ?,
             work_category = ?,
             type_of_work = ?,
             description = ?
             where id = ?;`
        )
        db.all(sql,[worker, task_stage, work_category, type_of_work, description, id], (err,rows) => {
            if (err) return res.json(err)
            else return res.json(rows)
    })
        
    }

    async MasterUpdateTasks(req,res){

        const { task_stage, description, id} = req.body
        const sql = (
            `update tasks 
            set 
             task_stage = ?,
             description = ?
             where id = ?;`
        )
        db.all(sql,[ task_stage, description, id], (err,rows) => {
            if (err) return res.json(err)
            else return res.json(rows)
    })
        
    }

    async deleteTasks(req,res){

        const { id } = req.body
        const sql = (
            `delete from tasks where id =?;`
        )
        db.all(sql,[id], (err,rows) => {
            if (err) return res.json(err)
            else res.json(rows)
         })
       
    }

}


async function checkStage(){
   
    const newObject = await getInfoForCheckStage(db)
   
    for(let i = 0; i < newObject.rows.length;i++){
        const dateString_deadline = newObject.rows[i].date_of_deadline;
        const dateObject_deadline = new Date(dateString_deadline);
        const dateString_creation = newObject.rows[i].date_of_creation;
        const dateObject_creation = new Date(dateString_creation);

        const daysDifference = Math.floor((dateObject_creation - dateObject_deadline) / (1000 * 60 * 60 * 24));
        console.log(daysDifference)
        if(daysDifference > 1 && newObject.rows[i].task_stage < 6 && newObject.rows[i].completed === null){
        await db.all(`update tasks set task_stage = 6 where id = ?;`, [ newObject.rows[i].id ])
        }
     }
}

async function getInfoForCheckStage(db) {
    return new Promise((resolve, reject) => {
        var responseObj;
        db.all(`select * from tasks;`,(err, rows) => {
            if (err) {
                responseObj = {
                  'error': err
                };
                reject(responseObj);
              } else {
                responseObj = {
                  rows: rows
                };
                resolve(responseObj);
            }
        });
    });
}

async function getInfoForCreate(db, id) {
    return new Promise((resolve, reject) => {
        db.get(
        `SELECT 
        obj.id,
        obj.category,
        obj.image,
        cat.master
 FROM 
     object obj
 JOIN 
     object_category cat ON obj.category = cat.id
    WHERE obj.id=?;`,[id],(err, row) => {
            if (err) reject(err); // I assume this is how an error is thrown with your db callback
            resolve(row);
        });
    });
}

module.exports = new TaskController()