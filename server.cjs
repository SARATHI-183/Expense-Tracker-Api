const express = require('express')
const bodyParser = require('body-parser')
const {connectToDb, getDb} = require('./db.cjs')
const { ObjectId } = require('mongodb')

const app = express()
app.use(bodyParser.json())
app.use(express.static(__dirname))

let db
connectToDb(function(error)
{
    if(!error)
    {
        const port = process.env.PORT || 8000
        app.listen(8000)
        console.log(`Listening on port ${port}...`)
        db=getDb()
    }
    else{
        console.log(error)
    }
})




app.post('/add-expense',function(request,response){
    db.collection('ExpenseData')
    .insertOne(request.body).then(function(){
        response.status(201).json({
            "status" : "data sucessfully entered"
        })
    }).catch(function(error){
        response.status(500).json({
            'error': error
        })
    })
    
})

app.get('/get-data',function(request,response){
    const entries = []
    db.collection('ExpenseData')
    .find()
    .forEach(entry => entries.push(entry))
    .then(function(){
        response.status(200).json(entries)
    }).catch(function(error){
        response.status(404).json({
            'error': error
        })
    })
})

app.delete('/delete-entry', function(request, response){
    console.log(request.body)
    if(ObjectId.isValid(request.body.id)){
        db.collection('ExpenseData').deleteOne({
            _id : new ObjectId(request.body.id)
        }).then(function() {
            response.status(201).json({
                'status' : 'data successfully deleted'
            })
        }).catch(function(error) {
            response.status(500).json({
                'error' : error
            })
        })
    }
    else{
        response.status(500).json({
            'status' : 'ObjectId not valid'
        })
    }
})

app.patch('/update-entry', function(request, response) {
    if(ObjectId.isValid(request.body.id)) {
        console.log(request.body.data)
        db.collection('ExpenseData').updateOne(
            {_id : new ObjectId(request.body.id)},
            {$set : request.body.data}
           
        ).then(function() {
            response.status(201).json({
                'status' : 'data successfully updated'
            })
        }).catch(function(error) {
            response.status(500).json({
                'error' : error
            })
        })
    }else {
        response.status(500).json({
            'status' : 'ObjectId not valid'
        })
    }
})

