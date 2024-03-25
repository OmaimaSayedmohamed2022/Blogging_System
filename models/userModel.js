const { DataTypes } = require('sequelize');
const sequelize = require('../config/database')
// const Post = require('../models/postModel')
// const Subscription = require('../models/subscriptionModel')
// const PostActions = require('../models/postActionsModel')

const User = sequelize.define('User', {
    userName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    roles: {
        type: DataTypes.ENUM('user', 'author'),
        allowNull: false
    },
    tokens:[{
        type: DataTypes.STRING, 
        allowNull: true, 
    }]
},{
    tableName: 'users',
    timestamps: false,
});

User.prototype.addSavedPost = async function(post) {
    await this.addPost(post);
};
User.associate = models => {
    User.hasMany(models.Post, { as: 'posts' });
    User.belongsToMany(models.Post, { through: 'SavedPosts', as: 'savedPosts' });
    User.hasMany(models.Subscription, {foreignKey: 'userId', as: 'subscriptions' });
    User.hasMany(models.Subscription, {foreignKey: 'authorId', as: 'subscriptions' });
    User.hasMany(models.postActions, {foreignKey: 'userId', as: 'postActions' });
};


// User.hasMany(Post, { foreignKey: 'UserId', as: 'posts' });
// User.belongsToMany(Post, { through: 'SavedPosts', as: 'savedPosts' });
// User.hasMany(Subscription, { foreignKey: 'userId', as: 'userSubscriptions' });
// User.hasMany(Subscription, { foreignKey: 'authorId', as: 'authorSubscriptions' });

module.exports = User;
