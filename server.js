const express = require('express')
const axios = require('axios')
const cors = require('cors')
const Redis = require('redis')
const redisClient = Redis.createClient();
const DEFUALT_EXPIRATION = 3600;

const app = express();
app.use(express.urlencoded({extended:true}))
app.use(cors())


app.get("/photos", async (req,res)=>{
    const albumId = req.query.albumId;

    redisClient.get("photos",async(error,photos)=>{
        if(error) console.log(err)
        if(photos != null){
            console.log('Cache Hit')
            res.json(JSON.parse(photos))
        }
        else{
            const {data} = await axios.get(
                "https://jsonplaceholder.typicode.com/photos",
                {params:{albumId}}
            )
            redisClient.setex('photos',DEFUALT_EXPIRATION,JSON.stringify(data));
            console.log('Cache Missed')
            res.json(data)
        }
    })

   
})

app.get("/photos/:id", async (req,res)=>{
    const albumId = req.query.albumId;
    const {data} = await axios.get(
        `https://jsonplaceholder.typicode.com/photos/${req.params.id}`,
        
    )
    res.json(data)
})

app.listen(1209);