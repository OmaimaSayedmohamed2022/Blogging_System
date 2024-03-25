const express = require ('express')
const app = express();
const db = require('./config/database')
const userRouter= require('./routers/userRouter')
const postRouter= require('./routers/postRouter')
const subscribeRouter = require('./routers/subscriptionRouter')
const postActionsRouter =require('./routers/postActionsRouter')
const images = require('./routers/uploadImageRouter')
const PORT = process.env.PORT || 3000 ;

app.use(express.json())
//routers
app.use('/user', userRouter)
app.use('/post', postRouter)
app.use('/subscribe', subscribeRouter)
app.use('/postActions',postActionsRouter)
app.use('/image',images)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//  sql connection
db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error);
  });