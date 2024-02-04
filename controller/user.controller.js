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

    async getUser(req,res){
        const {
            login,
            password} = req.body 
            console.log(req.body)
            console.log(login,password)

        const allUsers = await db.query(
            `select * from users where login=$1 AND password=$2`, [login,password]
        )
        

        if(allUsers.rowCount===0) res.json('Данные не совпадают! Проверьте и повторите попытку')
        else res.json(allUsers.rows[0])

    }

    async changeUserPassword(req,res){
        const {  password,login } = req.body
      
        const newObject = await db.query(
            `update users 
            set  password = $1
            where login = $2;`,
            [   password,
                login
            ]
        )
        res.json(newObject.rows[0])
    }

    async deleteUser(req,res){
        const { id } = req.body
      
        await db.query(
            `delete from users where id = $1;`, [ id]
        )
        res.json('deleted')
    }
    
}



module.exports = new UserController()