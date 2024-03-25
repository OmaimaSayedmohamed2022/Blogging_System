const { DataTypes} = require('sequelize')
const sequelize = require('../config/database')
const User = require('./userModel')
const Post = require('./postModel')

const SavedPosts = sequelize.define('savedPosts',{
    userId:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    postId:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    
},{
    tableName: 'savedPosts'
        
});
SavedPosts.belongsTo(User, { foreignKey: 'userId', as: 'user' });
SavedPosts.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

module.exports = SavedPosts;
