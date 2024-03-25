const User = require("../models/userModel")
const jwt = require('jsonwebtoken')
const {validateEmail,validatePassword,validateString}= require("../middleware/validation")
const bcrypt = require('bcrypt')


const createNewUser = async (req, res) => {
  try {
    const { userName, email, password, roles } = req.body;
      if (!validateEmail(email)) 
          return res.status(400).json({ status: 0, message: 'Invalid Email' });
      if (!validatePassword(password)) 
          return res.status(400).json({ status: 0, message: 'Invalid password' });
      if (!validateString(userName)) 
          return res.status(400).json({ status: 0, message: 'Invalid username' });

      const hashedPassword = bcrypt.hashSync(password, 10);

      const newUser = await User.create({ userName, email, password: hashedPassword, roles }, { timestamps: false });

      if (roles && roles.length > 0) {
          newUser.roles = roles;
      }
      res.status(201).json({ status: 1, success: 'User created successfully' });
  }catch (error) {     
      console.error('Error registering user:', error);
      res.status(500).json({ status: 0, message: 'Error registering user', error: error.message });
  }
};

const updateUser = async (req, res) => {
    try {
          const { id,userName,password,email,roles } = req.body;
    if (!validateEmail(email)) 
          return res.status(400).json({ status: 0, message: 'Email is INVALID' });
    if (!validatePassword(password)) 
          return res.status(400).json({ status: 0, message: 'Invalid password' });
    if (!validateString(userName)) 
          return res.status(400).json({ status: 0, message: 'Invalid username' });
          const user = await User.findByPk(id);
    if (!user) {
              return res.status(400).json({ message: 'user not found' });
        }
      const hashedPassword = bcrypt.hashSync(password, 10);
    if (roles && roles.length > 0) {
            user.roles = roles;
        }
        await user.update({id, userName,email, roles, password:hashedPassword})
    await user.save();

          res.status(200).json({ message: 'updated user successfully' });
    } catch (error) {
          console.error('Error updating user:', error);
          res.status(500).json({ message: 'Error updating user' });
      }
};
const deleteUser = async(req , res )=>{
    try{
      const {id} = req.body;
    if (!id){
    return res.status(400).json({message:'user id required'})
     }
      const deletedUser = await User.destroy({ where: { id }});

    if (!deletedUser){
    return res.status(400).json({status:0 , message:"user not found"})
    }
    res.status(200).json({status:1 , message:`user deleted successfully`})
    } 
    catch (error) {
  console.error('Error deleting user:', error);
  res.status(500).json({ status : 0 , message: 'Error deleting user' });
}
};

const getAllUsers = async (req, res) => {
   try {
      const users = await User.findAll({
        attributes: { exclude: ['password']} });
         res.json(users);
    } catch (error) {
      console.error('Error getting all users:', error);
      res.status(500).json({ message: 'Error getting all users' });
  }
};

const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!validateEmail(email)) 
        return res.status(400).json({ status: 0, message: 'Email is INVALID' });
      if (!validatePassword(password)) 
        return res.status(400).json({ status: 0, message: 'Invalid password' });
  
      const user = await User.findOne({ where: { email } });
     
      if (!user && !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 0, message: 'Invalid credentials' });
      }
  
      let tokens = JSON.parse(user.tokens);
      const token = jwt.sign({ userId: user.id }, process.env.KEY_TOKEN);
      // tokens.push(token);
  
      await User.update({ tokens: JSON.stringify(tokens)}, { where: { id: user.id } });
  
      return res.status(201).json({message: 'Logged Successfully', token });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  };
  
  

module.exports={
createNewUser,
updateUser,
deleteUser,
getAllUsers,
loginUser,
  }