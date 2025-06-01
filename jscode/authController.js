const User = require('./models/user'); 
const Role = require('./models/role'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const {secret} = require('./config');

const generatedAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"});
}

class authController {
    async registration(req, res) {
        try {
            console.log("REGISTRATION REQUEST:", req.body);
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({message: 'Error during registration', errors});
            }
            const {nickname, password} = req.body;
            const candidate = await User.findOne({nickname});
            if(candidate) {
                return res.status(400).json({message: 'A user with that name already exists'})
            }
            const hashedPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: "USER"});
            const user = new User({nickname, password: hashedPassword, roles: [userRole.value]});
            await user.save();
            // return res.json({message: 'The user has been successfully registered'})
            const token = generatedAccessToken(user._id, user.roles);
            return res.json({
                token, 
                nickname: user.nickname 
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json({message: 'Registration error'});
        }
    }
    async login(req, res) {
        try {
            const { nickname, password } = req.body;
            const user = await User.findOne({nickname});
            if(!user) {
                console.log(`A user with that nickname ${nickname} was not found`)
                return res.status(400).json({message: `A user with that nickname ${nickname} was not found`});
                // res.status(400).json({message: `A user with that nickname ${nickname} was not found`});
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if(!validPassword) {
                return res.status(400).json({message: `Incorrect password entered`});
                // res.status(400).json({message: `Incorrect password entered`});
            }
            const token = generatedAccessToken(user._id, user.roles);
            return res.json({
                token, 
                nickname: user.nickname 
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json({message: 'Login error'});
            // res.status(400).json({message: 'Login error'});
        }
    }
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
            
        } catch (error) {
            
        }
    }
    async updateScore(req, res) {
        try {
          const { mode, difficulty, score } = req.body;
          console.log(`UpdateHighScore authController.js. mode: ${mode}, difficulty: ${difficulty}, score: ${score}`);

          const userId = req.user.id; 
    
          let fieldName;
          if (mode === 'hardcore') {
            fieldName = 'hardcoreScore';
          } else if (mode === 'classic' || mode === 'special') {
            // example: 'classic' + 'BeginnerScore'
            // We bring the first letter of the difficulty level to the upper case and add "Score"
            fieldName = mode + difficulty.charAt(0).toUpperCase() + difficulty.slice(1) + 'Score';
          } else {
            return res.status(400).json({ message: 'Incorrect game mode' });
          }

          const user = await User.findById(userId);
          if (!user) {
            return res.status(404).json({ message: 'The user was not found' });
          }
    
          const currentHighScore = user[fieldName] || 0;
          if (score > currentHighScore) {
            user[fieldName] = score;
            await user.save();
            return res.json({ newHighScore: true, message: 'New high score!' });
          }
          
          return res.json({ newHighScore: false, message: 'The result did not beat the previous record' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error' });
        }
      }
    async getRanking(req, res) {
        try {
            const { mode, difficulty } = req.params;
    
            let fieldName;
            if (mode === 'hardcore') {
                fieldName = 'hardcoreScore';
            } else if (mode === 'classic') {
                fieldName = `classic${difficulty.charAt(0).toUpperCase()}${difficulty.slice(1)}Score`;
            } else {
                return res.status(400).json({ message: 'Incorrect game mode' });
            }
    
            // We get all the players by sorting them by the selected field from the largest to the smallest
            const ranking = await User.find({}, { nickname: 1, [fieldName]: 1 }) 
                                    .sort({ [fieldName]: -1 }) 
                                    .limit(40); 
    
            res.json(ranking);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
    async getHardcoreRanking(req, res) {
        try {
            const ranking = await User.find({}, { nickname: 1, hardcoreScore: 1 })
                                      .sort({ hardcoreScore: -1 })
                                      .limit(40);
    
            res.json(ranking);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
    
    
}

module.exports = new authController();