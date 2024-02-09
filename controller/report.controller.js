const db = require('../config')

class ReportController{

    async getReport1(req,res){
        
        const sql = (
            `SELECT 
            tasks.id AS task_id,
            tasks.description AS task_description,
            tasks.date_of_creation AS task_creation_date,
            tasks.date_of_deadline AS task_deadline,
            type_of_work.type AS work_type
        FROM 
            tasks
        JOIN 
            type_of_work ON tasks.type_of_work = type_of_work.id;`
        )
        db.all(sql,[], (err,rows) => {
            if (err) return res.json(err)
            else return res.json(rows)
    })

    }   

    async getReport2(req,res){
        
      
        const sql = (
            `SELECT 
            object_category.category AS object_category,
            work_category.name AS work_category,
            COUNT(tasks.id) AS task_count
        FROM 
            tasks
        JOIN 
            object ON tasks.object = object.id
        JOIN 
            object_category ON object.category = object_category.id
        JOIN 
            work_category ON tasks.work_category = work_category.id
        GROUP BY 
            object_category.category, work_category.name;
        `
        )
        db.all(sql,[], (err,rows) => {
            if (err) return res.json(err)
            else return res.json(rows)
    })

    }   

    async getReport3(req,res){
        
        const sql = (
            `SELECT 
            users.id AS user_id,
            users.fio AS user_name,
            users.phone AS user_phone,
            COUNT(tasks.id) AS assigned_tasks_count
        FROM 
            users
        JOIN 
            tasks ON users.id = tasks.worker
            WHERE users.role =2
        GROUP BY 
            users.id, users.fio, users.phone`
        )
        db.all(sql,[], (err,rows) => {
            if (err) return res.json(err)
            else return res.json(rows)
    })

    }   

    async getReport4(req,res){
        
        const sql = (
            `SELECT 
            SUM(CASE WHEN tasks.task_stage = 5 THEN 1 ELSE 0 END) AS completed_tasks_count,
            SUM(CASE WHEN (tasks.task_stage < 3 or tasks.task_stage=4) THEN 1 ELSE 0 END) AS inprocess_tasks_count,
            SUM(CASE WHEN (tasks.task_stage = 3 ) THEN 1 ELSE 0 END) AS cancel_tasks_count,
            SUM(CASE WHEN (tasks.task_stage = 6 ) THEN 1 ELSE 0 END) AS loosedeadline_tasks_count
        FROM 
            tasks;`
        )

        db.all(sql,[], (err,rows) => {
            if (err) return res.json(err)
            else return res.json(rows)
    })

    }   
    


}



module.exports = new ReportController()