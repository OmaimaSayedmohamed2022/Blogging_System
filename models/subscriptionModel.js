const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')
const User = require('./userModel')

const Subscription = sequelize.define('Subscription',{
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    authorId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
},{
    tableName: 'subscriptions'
        
}
    
);
Subscription.belongsTo(User, { foreignKey: 'userId', as: 'user' }); 
Subscription.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

module.exports = Subscription
