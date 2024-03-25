const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const PostActions = require('./postActionsModel')

const Comments = sequelize.define('Comments', {
  content: {
    type: DataTypes.TEXT,
    allowNull: true
    },
  hidden: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false 
    },
  like:{
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
  parentId:{
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: 0
  },  
  replyCount: {
    type: DataTypes.VIRTUAL,
     get() {
      return Comments.count({ where: { parentId: this.id } });
    }
  },
  userId:{
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  } 

}, {
    tableName: 'Comments',
    timestamps: false,
});

Comments.prototype.getReplies = async function() {
  try {
      const replies = await Comments.findAll({ where: { parentId: this.id } });
      return replies;
  } catch (error) {
      console.error('Error retrieving replies for comment:', error);
      throw error;
  }
};
 
PostActions.hasMany(Comments, { foreignKey: 'userId'}); 

module.exports = Comments;
