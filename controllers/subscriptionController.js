const User = require('../models/userModel')
const Subscription = require('../models/subscriptionModel');
const nodemailer = require('nodemailer')
const { where } = require('sequelize');

const userSubscribeAuthor = async(req , res)=>{
try{
const {userId , authorId} = req.body;

const user = await User.findByPk(userId)

 if(!user){
    return res.json({message:'user not found'})
 }
 const author = await User.findByPk(authorId)
if(!author){
    return res.json({message:'author not found'}) 
}
await Subscription.create({userId , authorId})

res.status(200).json({status:1 , message:"user Subscribe Author successfully"})

}catch(error){
    console.log('error in user Subscribe Author', error)
    res.status(500).send({message:'error in user Subscribe Author'})
}
};

const userUnSubscribeAuthor = async(req , res)=>{
    try{
        const {userId , authorId} = req.body;
        const subscription = await Subscription.findOne({
              where: { userId, authorId }
        });
        
    if(!subscription ){
            return res.json({message:'subscription not found'})
         }
       
    await Subscription.destroy({where: { userId, authorId }});
        res.status(200).json({status:1 , message:"user UnSubscribe Author successfully"})
        
    }catch(error){
        console.log('error in user UnSubscribe Author', error)
        res.status(500).send({message:'error in user UnSubscribe Author'})
        }
};

const getAllSubscribedAuthors = async(req , res)=>{
    try{
        const {authorId} = req.body;
        const author = await Subscription.findAll({where:{authorId:authorId}}) 
    if(!author){
        return res.json({message: 'author not found'})
      }
        res.status(200).json(author)
    }catch(error){
        console.log('can not get authors ',error)
        res.status(500).json({message:'can not get authors'})
    }
};

module.exports={
userSubscribeAuthor,
userUnSubscribeAuthor,
getAllSubscribedAuthors,

}