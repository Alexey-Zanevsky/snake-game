const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nickname: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    classicBeginnerScore: Number,
    classicAdvancedScore: Number,
    classicExpertScore: Number,
    specialBeginnerScore: Number,
    specialAdvancedScore: Number,
    specialExpertScore: Number,
    hardcoreScore: Number,  
    achievments: [String]
});

module.exports = mongoose.model('User', userSchema);
