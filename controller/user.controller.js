const db = require('../config')

class UserController{
    async createUser(req,res){
        
        const {
            
            fio,
            login,
            password,
            role,
            phone
        } = req.body
        console.log( fio, login, password, role, phone)

        const newUser = await db.query(
            `insert into users (fio, login, password, role, phone) values ($1, $2, $3, $4, $5) returning *`,
             [ fio, login, password, role, phone]
        )
        res.json(newUser.rows[0])
    }   
    async getAllUsers(req,res){
        const {
            login,
            password} = req.body 

        const allUsers = await db.query(
            `select * from Users where login=$1 AND password=$2`, [login,password]
        )
        

        if(allUsers.rowCount===0) res.json('Логин или пароль не тот лол, а возможно и не зареган кек')
        else res.json(allUsers.rows[0].id)

    }
    async getOneUser(req,res){



    }
    async updateUser(req,res){

    }
    async deleteUser(req,res){

    }

}

module.exports = new UserController()