const db = require('../config')

class ObjectController{

    async createObject(req,res){
            
        const { name, address, inn, contact, category, image } = req.body
        const sql = (
            `insert into object ( name, address, inn, contact, category, image) values ($1, $2, $3, $4, $5, $6);`
        )
        db.all(sql,[name, address, inn, contact, category, image], (err,rows) => {
            if (err) return res.json(err)
            else return res.json(rows)
    })
    } 
    
    async updateObject(req,res){
        const { name, address, inn, contact, category, image, id } = req.body
        const sql = (
            `update object 
            set name = ?,
            address = ?,
            inn = ?,
            contact = ?,
            category = ?,
            image = ?
            where id = ?;`
        )
        db.all(sql,[name, address, inn, contact, category, image, id], (err,rows) => {
            if (err) return res.json(err)
            else return res.json(rows)
    })
        
    }

    async deleteObject(req,res){
        const { id } = req.body
        const sql = (
            `delete from object where id = ?;`
        )
        db.all(sql,[id], (err,rows) => {
            if (err) return res.json(err)
            else return res.json(rows)
    })
        
    }

    async getAllObjectsAdmin(req,res){
        
        const { contact } = req.body
        const sql = (
            `SELECT 
            o.id AS object_id,
            o.name AS object_name,
            o.address AS object_address,
            o.inn AS object_inn,
            o.contact AS object_contact,
            oc.category AS object_category,
            oc.master AS object_category_master,
            o.image AS object_image,
            u.id AS user_id,
            u.fio AS user_fio,
            u.phone AS user_phone,
            SUM(CASE WHEN tasks.task_stage = 4 THEN 1 ELSE 0 END) AS tasks_count
        FROM 
            object AS o
        JOIN 
            object_category AS oc ON o.category = oc.id
        JOIN 
            users AS u ON o.contact = u.id
        LEFT JOIN 
            tasks ON o.id = tasks.object
        GROUP BY 
            o.id, o.name, o.address, o.inn, o.category, o.image, o.contact;`
        )
        db.all(sql,[contact], (err,rows) => {
            if (err) return res.json(err)
            else return res.json(rows)
    })
    }

    async getAllObjectsForCurrentUser(req,res){
        
        const { contact } = req.body
        const sql = (
            `select * from object where "contact"=?;`
        )
        db.all(sql,[contact], (err,rows) => {
            if (err) return res.json(err)
            else return res.json(rows)
    })
    }

    async getSelectedObjectsForCurrentUser(req,res){
        const { id } = req.body
        const sql = (
            `select * from object where "id"=?;`
        )
        db.all(sql,[id], (err,rows) => {
            if (err) return res.json(err)
            else return res.json(rows)
    })
    }

   async getAllObjects(req,res){

        const sql = 
        `SELECT 
        o.id AS object_id,
        o.name AS object_name,
        o.address AS object_address,
        o.inn AS object_inn,
        o.contact AS object_contact,
        oc.category AS object_category,
        oc.master AS object_category_master,
        o.image AS object_image,
        u.id AS user_id,
        u.fio AS user_fio,
        u.phone AS user_phone
    FROM 
        object AS o
    JOIN 
        object_category AS oc ON o.category = oc.id
    JOIN 
        users AS u ON o.contact = u.id;`
       await db.all(sql,[], (err,rows) => {
            if (err) return res.json(err)
            else return res.json(rows)
       })

    }

    async getAllObjectsByOwner(req,res){

        const {id} = req.body
       
        const sql = 
            `SELECT 
            o.id AS object_id,
            o.name AS object_name,
            o.address AS object_address,
            o.inn AS object_inn,
            o.contact AS object_contact,
            oc.category AS object_category,
            oc.master AS object_category_master,
            o.image AS object_image,
            u.id AS user_id,
            u.fio AS user_fio,
            u.phone AS user_phone
        FROM 
            object o
        JOIN 
            object_category oc ON o.category = oc.id
        JOIN 
            users u ON o.contact = u.id
        WHERE  u.id= ?;`

        db.all(sql,[id], (err,rows) => {
            if (err) return res.json(err)
            else return res.json(rows)
       })
    }

    async getAllObjectsByCategory(req,res){

        const {category} = req.body;

        const sql =
            `SELECT 
            o.id AS object_id,
            o.name AS object_name,
            o.address AS object_address,
            o.inn AS object_inn,
            o.contact AS object_contact,
            oc.id AS object_category_id,
			oc.category AS object_category,
            oc.master AS object_category_master,
            o.image AS object_image,
            u.id AS user_id,
            u.fio AS user_fio,
            u.phone AS user_phone
        FROM 
            object o
        JOIN 
            object_category oc ON o.category = oc.id
        JOIN 
            users u ON o.contact = u.id
            WHERE  oc.id=?;`

            db.all(sql,[category], (err,rows) => {
                if (err) return res.json(err)
                else return res.json(rows)
           })
    }

    async getAllObjectsByCategoryAndOwner(req,res){

        const {id,category} = req.body

       const sql = 
            `SELECT 
            o.id AS object_id,
            o.name AS object_name,
            o.address AS object_address,
            o.inn AS object_inn,
            o.contact AS object_contact,
            oc.id AS object_category_id,
			oc.category AS object_category,
            oc.master AS object_category_master,
            o.image AS object_image,
            u.id AS user_id,
            u.fio AS user_fio,
            u.phone AS user_phone
        FROM 
            object o
        JOIN 
            object_category oc ON o.category = oc.id
        JOIN 
            users u ON o.contact = u.id
        WHERE u.id=? AND oc.id=?;`
        
        db.all(sql,[id, category], (err,rows) => {
            if (err) return res.json(err)
            else return res.json(rows)
       })
    }
  
}

module.exports = new ObjectController()