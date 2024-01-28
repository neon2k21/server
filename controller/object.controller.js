const db = require('../config')

class ObjectController{
    
    async createObject(req,res){
        
        const {
            
           name,
           address,
           inn,
           contact,
           category
        } = req.body

        name, address, inn, contact, category
        const newObject = await db.query(
            `insert into object ( name, address, inn, contact, category) values ($1, $2, $3, $4, $5) returning *`,
             [  name, address, inn, contact, category]
        )
        res.json(newObject.rows[0])
    }   
    
    async getAllObjectsForCurrentUser(req,res){
        const { contact } = req.body
        const newObject = await db.query(
            `select * from  object where contact=$1;`,[contact]
        )
        res.json(newObject.rows[0])
    }

    async getAllObjects(req,res){
        const newObject = await db.query(
            `select * from  object;`
        )
        res.json(newObject.rows[0])
    }

    async updateObject(req,res){
        const {  name,
            address,
            inn,
            contact,
            category, 
            id } = req.body
      
        const newObject = await db.query(
            `update object 
            set  name = $1,
            set address = $2,
            set inn = $3,
            set contact = $4,
            set category = $5
            where id = $6;`,
            [   name,
                address,
                inn,
                contact,
                category, 
                id
            ]
        )
        res.json(newObject.rows[0])
    }

    async deleteObject(req,res){
        const { id } = req.body
      
        await db.query(
            `delete from object where id = $1;`, [ id]
        )
        res.json('deleted')
    }

}

module.exports = new ObjectController()