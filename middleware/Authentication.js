const { message } = require('statuses');
const User = require('../models/userModel')
const Post = require('../models/postModel')
const Comments = require('../models/commentModel')

const userAuthentication= async(req , res,next)=>{
    try{
  const {userId}=req.body;
  const user = await User.findOne({where:{id:userId}})

   if(!user){
   return res.send ({message:'user not found'})
   }

   if (user && user.roles === 'author') {
    return res.status(404).json({ message: 'author can`t make comment'});
      }
     // res.send({message:'authenticated user'})
    return next();
   } catch (error) {
        console.error('Error authenticating user', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const postAuthentication = async(req , res,next)=>{

   try{
      const {postId}=req.body;
      const post = await Post.findOne({where:{id:postId}})
       if(!post){
       return res.send ({message:'user not found'})
       }
       return next();
       } catch (error) {
            console.error('Error authenticating post', error);
            res.status(500).json({ message: 'Internal server error' });
        }
}
const authorAuthentication = async(req , res, next)=>{
try{
   const {id,authorId} = req.body;
   const author = await User.findOne({ where: { id: authorId } });
   const comment = await Comments.findOne({ where: {id}});

if(!comment){
   return res.status(404).json({message:'commnt not found'})
}
if (!author) {
          return res.status(404).json({ message: 'Author not found' });
      }
if (author.id !== comment.userId) {
          return res.status(403).json({ message: 'You are not authorized to delete this comment' });
      }
return next();
} catch (error) {
     console.error('Error authenticating author', error);
     res.status(500).json({ message: 'Internal server error' });
 }
}
const commentAuthentication= async(req, res, next)=>{
   try{
    const{id,userId}= req.body;
    const comment = await Comments.findOne({ where:{id}});
    if (!comment){
        return res.status(400).json({ message: 'Comment not found' });
       }
   const user = await User.findOne({ where: { id: userId } });
   if (user.id !== comment.userId) {
          return res.status(403).json({ message: 'You are not authorized to delete this comment' });
         }
  return next();
   } catch (error) {
         console.error('Error authenticating commenent', error);
         res.status(500).json({ message: 'Internal server error' });
     }
}

module.exports = {
   userAuthentication,
   postAuthentication,
   authorAuthentication,
   commentAuthentication
}