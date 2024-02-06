const db = require('../config')

class UserController{

    async createUser(req,res){
        
        const { fio, login, password, role, phone } = req.body
        const sql = (
            `insert into users (fio, login, password, role, phone) values (?, ?, ?, ?, ?);`
        )
        db.all(sql,[fio, login, password, role, phone], (err,rows) => {
            if (err) return res.json(err)
            else return res.json(rows)
    })

    }   

    async getUser(req,res){
        const { login, password} = req.body
        console.log(login, password)
        const sql = (
            `select * from users where login=? AND password=?;`
        )
        db.all(sql,[login,password], (err,rows) => {
            if (err) return res.json(err)
            if(rows.length === 0) return res.json('Данные не совпадают! Проверьте и повторите попытку')
            else res.json(rows)
    })
    }

    async getMaster(req,res){
     
        const sql = (
            `select * from users where role=2;`
        )
        db.all(sql,[], (err,rows) => {
            if (err) return res.json(err)
            else res.json(rows)
    })
    }

    async deleteUser(req,res){
        const { id } = req.body
        const sql = (
            `delete from users where id =?;`
        )
        db.all(sql,[id], (err,rows) => {
            if (err) return res.json(err)
            else res.json(rows)
         })
        
    }    
}



module.exports = new UserController()