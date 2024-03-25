const Post = require('../models/postModel')
const User = require('../models/userModel')
const SavedPosts = require('../models/savedPostsModel')
const nodemailer= require('nodemailer')
const Subscription = require('../models/subscriptionModel')

// const createPost= async(req,res)=>{
//     try {
//         const { title, content,cover_image,published,categories,summary,draft,authorId,userId} = req.body;

//         await Post.create({ title, content,cover_image,published,categories,summary,draft,authorId});

//         const SubscribedUsers = await Subscription.findByPk(authorId);

//        console.log (SubscribedUsers)


//         res.status(201).json({message:'post created successfuly'});
       
//     } catch (error) {
//         console.error('Error creating post:', error);
//         res.status(500).json({ message: 'Error creating post' });
//     }

// };

const sendEmail = async (emailContent) => {
    try {
        console.log(emailContent)

        const transporter = nodemailer.createTransport({
                host: process.env.E_host,
                port: 2525,
                auth: {
                  user: process.env.E_user,
                  pass: process.env.E_pass
                }
              });
        await transporter.sendMail({
            from: process.env.E_user,
            to: emailContent.to,
            subject: emailContent.subject,
            text: emailContent.text
        });
        console.log('Email sent successfully');
        return true
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const createPost = async (req, res) => {
    try {
        const { title, content, cover_image, published, categories, summary, draft, authorId } = req.body;

        const newPost = await Post.create({ title, content, cover_image, published, categories, summary, draft, authorId});

        const subscriptions = await Subscription.findAll({
            where: { authorId }
        });

        if (!subscriptions || subscriptions.length === 0) {
            return res.status(400).json({ message: 'No users subscribed to this author' });
        }

        
        const emailContent = {
            subject: 'New Post Notification',
            text: `A new post "${title}" has been published by the author. You can read it here: ${process.env.HOST}/posts/${newPost.id}`
            
        };

        await Promise.all(subscriptions.map(async (subscription) => {
            const user = await User.findByPk(subscription.userId);
            if (user) {
                emailContent.to = user.email;
    
                return await sendEmail(emailContent);
            }
        }));

        res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Error creating post' });
    }
};

const publishPost = async (req, res) => {
    try {
        const {postId} = req.body;
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        post.published = true;
        await post.save();
        res.json({ message: 'Post published successfully' });
    } catch (error) {
        console.error('Error publishing post:', error);
        res.status(500).json({ message: 'Error publishing post' });
    }
};

const unpublishPost = async (req, res) => {
    try {
        const {postId} = req.body;
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        post.published = false;
        await post.save();
        res.json({ message: 'Post unpublished successfully' });
    } catch (error) {
        console.error('Error unpublishing post:', error);
        res.status(500).json({ message: 'Error unpublishing post' });
    }
};

const updatePost = async (req, res) => {
    try {
        const {postId,title,content} = req.body;
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        post.title = title;
        post.content = content;
        const updatedPost = await post.save();
        res.json({ message:'Post updated successfully',updatedPost});
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Error updating post' });
    }
};

const deletePost = async (req, res) => {
    try {
        const {postId }= req.body;
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        await post.destroy();
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Error deleting post' });
    }
};

const getAuthorPosts = async (req, res) => {
    try {
        const {authorId} = req.body;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10; 
        const { count, rows } = await Post.findAndCountAll({
            where: { authorId }, 
            order: [['created_at', 'DESC']],
            limit: pageSize,
            offset: (page - 1) * pageSize
        });

      return res.json({ count, rows });
    } catch (error) {
        console.error('Error fetching author posts:', error);
        res.status(500).json({ message: 'Error fetching author posts' });
    }
};

const savePostsForUser = async(req , res)=>{
try{
 const {userId , postId} = req.body;
 const user = await User.findByPk(userId)
if(!user){
  return  res.status(404).json({message: 'user not found'})
}
const post = await Post.findByPk(postId)

if(!post){
    return  res.status(404).json({message:'post not found'})
  }
  await SavedPosts.create({ userId, postId });

 return res.status(200).json({message:'Post saved successfuly for User'})

} catch (error) {
          console.error('Error saving post for user:', error);
          res.status(500).json({ message: 'Error saving post for user'});
}
};

const getSavedPostsForUser = async (req , res) => {
    try {
        const {userId }= req.body; 
        const savedPosts = await SavedPosts.findAll({where: { userId: userId }})
           
       return res.status(200).json(savedPosts);
    } catch (error) {
        console.error('can not get saved posts for user', error);
        res.status(500).json({ message: 'can not get saved posts for user' });
    }
};

const removeSavedPostForUser = async (req, res) => {
    try {
        const {userId,postId} = req.body; 

        const savedPost = await SavedPosts.findOne({where: {userId: userId, postId: postId }});

        if (!savedPost) {
            return res.status(404).json({ message: 'Saved post not found for the user' });
        }
        await savedPost.destroy();

        res.status(200).json({ message: 'Saved post removed successfully' });
    } catch (error) {
        console.error('Error removing saved post:', error);
        res.status(500).json({ message: 'Error removing saved post' });
    }
};

module.exports={
createPost,
publishPost,
unpublishPost,
updatePost ,
deletePost,
getAuthorPosts,
savePostsForUser,
getSavedPostsForUser,
removeSavedPostForUser
}