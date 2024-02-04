const db = require('../config')

class ObjectController{
    
    async createObject(req,res){
        
        const {
            
           name,
           address,
           inn,
           contact,
           category,
           image
        } = req.body

        name, address, inn, contact, category
        const newObject = await db.query(
            `insert into object ( name, address, inn, contact, category, image) values ($1, $2, $3, $4, $5, $6) returning *`,
             [  name, address, inn, contact, category, image]
        )
        res.json(newObject.rows[0])
    }   
    
    async getAllObjectsForCurrentUser(req,res){
        const { contact } = req.body
        const newObject = await db.query(
            `select * from  object where "contact"=$1;`,[contact]
        )
        res.json(newObject.rows)
    }

    async getSelectedObjectsForCurrentUser(req,res){
        const { id } = req.body
        const newObject = await db.query(
            `select * from  object where "id"=$1;`,[id]
        )
        res.json(newObject.rows)
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
            image, 
            id } = req.body
      
        const newObject = await db.query(
            `update object 
            set "name" = $1,
            address = $2,
            inn = $3,
            contact = $4,
            category = $5,
            image = $6
            where id = $7;`,
            [   name,
                address,
                inn,
                contact,
                category, 
                image,
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