const db = require('../config')

class UserController{
    async createUser(req,res){
        
        const {
            id,
            name,
            surname,
            login,
            password,
            role,
            phone
        } = req.body
        console.log( name, surname, login, password, role, phone)
        const newUser = await db.query(
            `insert into hackaton."Users" (id, "Name", "Surname", login, password, role, phone) values ($1, $2, $3, $4, $5, $6, $7) returning *`,
             [ id, name, surname, login, password, role, phone]
        )
        res.json(newUser.rows[0])
    }   
    async getAllUsers(req,res){

    }
    async getOneUser(req,res){

    }
    async updateUser(req,res){

    }
    async deleteUser(req,res){

    }

}

module.exports = new UserController()