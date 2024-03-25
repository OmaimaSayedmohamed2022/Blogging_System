const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('../models/userModel')
const Post = require('../models/postModel')

const PostAction = sequelize.define('PostAction', {
      type: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
      },
      userId:{
        type:DataTypes.INTEGER,
         allowNull:false
      },
      postId:{
        type:DataTypes.INTEGER,
        allowNull:false
      }, 
}, {
    tableName: 'postAction',
    timestamps: false,
});

PostAction.belongsTo(User, { foreignKey: 'userId', as: 'user' }); 
PostAction.belongsTo(Post, { foreignKey: 'postId', as: 'post' }); 

module.exports = PostAction;
