const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require('express/lib/response');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors')
app.use(cors())
app.use(express.json())

// 3igGwRE6sREzM7kF
//taskManager


const { query } = require('express');
const uri = "mongodb+srv://taskManager:3igGwRE6sREzM7kF@myfirstdb.w4kvmll.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const alltaskcollection = client.db('taskmanager').collection('tasks');
        const everytaskcollection = client.db('taskmanager').collection('alltask')
        app.get('/tasks', async(req,res)=>{
            const email = req.query.email;

            let query = {}
            if(email){
                query = {email : email}
            }
            const result = await alltaskcollection.find(query).toArray();
            res.send(result);
        })
        app.get('/alltasks', async(req,res)=>{
            const query = {}
            const result = await everytaskcollection.find(query).toArray();
            res.send(result);
        })
        app.put('/task/update/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const task = req.body;
            const option = { upsert: true }
            const updatedUser = {
                $set: {
                    completion: task.completion,
                }
            }
            const result = await everytaskcollection.updateOne(filter, updatedUser, option);
            res.send(result);
        })

        app.post('/tasks', async(req,res)=>{
            const task = req.body;
            const result = await everytaskcollection.insertOne(task);
            res.send(result);
        })
        app.post('/task', async(req,res)=>{
            const task = req.body;
            const result = await alltaskcollection.insertOne(task);
            res.send(result);
        })
        app.delete('/task', async (req, res) => {
            const id = req.query.id;
            const query = { _id: ObjectId(id) };
            console.log(query)
            const result = await alltaskcollection.deleteOne(query);
            res.send(result)
        })
        app.get('/task', async(req,res)=>{
            const task_id = req.query.task_id;
            let query = {}
            if(task_id){
                query = {task_id};
            }
            const result = await everytaskcollection.findOne(query);
            res.send(result)
        })

        app.get('/completedtask', async(req,res)=>{
            const completeStatus = req.query.completion;
            const email = req.query.email;
            let query = {}
            if(completeStatus){
                query = {completion : completeStatus, email : email}
            }
            console.log(query)
            const result = await everytaskcollection.find(query).toArray()
            res.send(result);
        })

    }
    finally{

    }
}

run().catch(console.log)



app.get('/', (req,res)=>{
    res.send('api is running')
})


app.listen(port, ()=>{
    console.log(`api is running on port ${port}`)
})