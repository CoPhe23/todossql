import express from 'express'
import cors from 'cors'
import { configDB } from './configDB.js'
import mysql from 'mysql2/promise'

const app = express()
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 8000

let connection

try{
    connection  = await mysql.createConnection(configDB)
}catch (error){
    console.log(error)
}

app.get('/todos',async (req,res) => {
    try {
        const sql = 'SELECT * FROM todolist order by timestamp desc'
        const [rows,fields] = await connection.execute(sql)
        console.log(rows);
        console.log(fields);
        res.status(200).send(rows)
        
        

    } catch (error) {
        console.log(error);
        
    }
})
app.post('/todos',async (req,res) =>{
    if(!req.body) return res.json({msg:"Hiányos adat"})
    const {task} = req.body
    if(!task) return response.json({msg:"hiányos adat"})
        try {
            const sql = 'insert into todolist (task) VALUES (?)'
            const values=[task]
            const [result] = await connection.execute(sql,values)
            console.log(result);
            res.status(201).json({msg:"Sikeres hozzáadaás!"})
            
        } catch (error) {
            console.log(error);
            
        } 
})

app.delete('/todos/:id',async (req,res) =>{
        const {id}=req.params
        try {
            const sql="delete from todolist where id=?"
            const values=[id]
            const [rows] = await connection.execute(sql,values)
            console.log(rows.affectedRows);
            if(rows.affectedRows==0) return res.json({msg:"Nincs mit törölni"})
            res.status(201).json({msg:"Sikeres törlés"})
            
        } catch (error) {
            console.log(error);
            
        }
})


app.listen(port,console.log(`Server listening on port ${port}`));
