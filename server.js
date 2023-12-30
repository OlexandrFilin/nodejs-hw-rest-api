import app from './app.js';
import mongoose from 'mongoose';

const {DB_HOST, PORT=3000,JWT_SECRET} =process.env;
//console.log('JWT_SECRET', JWT_SECRET)

mongoose.connect(DB_HOST)
.then(()=>{
  app.listen(PORT, () => {
  console.log("Database connection successful port: 3000")
})
})
.catch(error =>{
 console.log(error.message)
})

