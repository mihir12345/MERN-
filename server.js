const express=require('express')
const connectDB=require('./config/db')
const app=express()
// require('./api')


connectDB()
app.get('/',(req,res)=>{
    res.send('res from the web')
})

//initialize middleware
app.use(express.json({extended:false}))

app.use('/api/users',require(`./routes/api/users`))
app.use('/api/posts',require(`./routes/api/posts`))
app.use('/api/auth',require(`./routes/api/auth`))
app.use('/api/profile',require(`./routes/api/profile`))


const PORT=process.env.PORT||5000

app.listen(PORT,()=>console.log(`listening at port ${PORT}`))