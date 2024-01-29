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

    async getIDForUser(req,res){
        const {
            login,
            password} = req.body 

        const allUsers = await db.query(
            `select * from users where login=$1 AND password=$2`, [login,password]
        )
        

        if(allUsers.rowCount===0) res.json('Логин или пароль не тот лол, а возможно и не зареган кек')
        else res.json(allUsers.rows[0].id)

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