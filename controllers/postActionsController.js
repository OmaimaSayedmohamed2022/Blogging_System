const { message } = require('statuses');
const PostActions= require('../models/postActionsModel')
const User = require('../models/userModel')
const Post =require('../models/postModel')
const { Op, where } = require('sequelize');
const Comments = require('../models/commentModel')
const sequelize = require('sequelize')
const {validateType} = require('../middleware/validation')

const createAction = async (req, res) => {
    try{
       const {action,userId,postId ,type}= req.body;
       const newlike= await PostActions.create({action,userId,postId,type})
       const ActionsCount = await PostActions.findAll({
        attributes: ['type', [sequelize.fn('COUNT', sequelize.col('type')), 'count']],
        where: { type: ['like', 'dislike', 'love','care'] },
        group: ['type']
      });
    if(!validateType(type)){
        return res.status(400).json({message: 'Invalid type' });
    }
        return res.status(201).json({ message: 'action created successfully', newlike,ActionsCount});
    }catch(error){
       console.log('Creating Like Error' ,error)
       res.status(500).json({message:'Creating Like Error'})
        }
    }

const deleteAction= async(req , res)=>{
    try {
    const {id} = req.body;
    await PostActions.destroy({ where:{id} });
      return  res.status(200).json({ message: 'action deleted successfully' });
        }catch (error) {
            console.error('Deleting Action Error', error);
            res.status(500).json({ message: 'Deleting Action Error' });
     }
    };
const deleteComment = async (req, res) => {
      try {
          const {id} = req.body;
            await Comments.destroy({ where:{id} });
             res.status(200).json({ message: 'Comment deleted successfully' });
      } catch (error) {
             console.error('Deleting Comment Error', error);
             res.status(500).json({ message: 'Deleting Comment Error' });
      }
     };
const createComment = async (req , res)=>{
      try{
        const {content ,userId,postId,parentId}= req.body;
        const commentCount = await Comments.count(Comments);
        const newComment= await Comments.create({content ,userId,postId,parentId})
        // const replyCount = await Comments.count({ where: { parentId: newComment.id } });

        newComment.replyCount = replyCount;

       return  res.status(201).json({message: 'create Comment successfully',newComment,commentCount})

        }catch(error){
        console.log('error in creating comment ' , error)
        res.status(500).json({message:'creating Comment Error'})
        }
       };

const getCommentReplies = async (req, res) => {
    try {
        const {commentId } = req.body; 
        const comment = await Comments.findByPk(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const replies = await comment.getReplies();

        return res.status(200).json({ comment, replies });
    } catch (error) {
        console.error('Error retrieving comment and replies:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const replyOnComment = async(req, res) => {
    try {
        const {commentId,content, userId  } = req.body; 
        const parentComment = await Comments.findByPk(commentId);

        if (!parentComment) {
            return res.status(404).json({ message: 'Parent comment not found' });
        }
        const reply = await Comments.create({
            content,
            userId,
            postId: parentComment.postId, 
            parentId: commentId 
        });

        return res.status(201).json({ message: 'Reply created successfully', reply });
    } catch (error) {
        console.error('Error creating reply:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const likeComment = async(req , res)=>{
    try{
        const {userId,like}= req.body;
        const newlike= await Comments.create({userId ,like})
        return res.status(201).send({message:'like created successfuly' ,newlike})

    }catch(error){
         console.log('error in like a comment ' ,error)
         res.status(500).json({message:'like a Comment Error'})
        }
   };

const hideComment = async (req, res) => {
    try {
        const { id, authorId } = req.body;
        const comment = await Comments.findOne({ where: { id } });
        if (!comment) {
            return res.status(400).json({ message: 'Comment not found' });
        }

        const author = await User.findOne({ where: { id: authorId } });
        if (!author) {
            return res.status(400).json({ message: 'Author not found' });
        }
        const hiddenComment = await Comments.update({ hidden: true }, { where: { id } });

        return res.status(200).json({ message: 'Comment hidden successfully', hiddenComment });
    } catch (error) {
        console.error('Error hiding comment', error);
        return res.status(500).json({ message: 'Error hiding comment' });
    }
};

module.exports={
    createComment,
    createAction,
    deleteComment,
    likeComment,
    hideComment,
    deleteAction,
    replyOnComment,
    getCommentReplies
    // getActionsofPost,
    
}