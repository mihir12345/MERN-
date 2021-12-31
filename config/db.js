const mongoose=require('mongoose')
const config=require('config')
// const db=config.get('mongoURI')

const connectDB=async()=>{
    try{
await mongoose.connect( `mongodb+srv://mihir:mihir@autho.gatpd.mongodb.net/testDB?retryWrites=true&w=majority`,{
    useNewUrlParser: true,
      useUnifiedTopology: true,
    //   useCreateIndex:true
} )
console.log('db is connected')

    }catch(err){
        console.error(err.meassage)
        console.log('error')
process.exit(1)
    }
}

module.exports=connectDB

// `mongodb+srv://mihir:mihir@autho.gatpd.mongodb.net/testDB?retryWrites=true&w=majority`