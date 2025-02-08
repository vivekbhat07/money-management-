import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    totalCurrnetExpense:{type:Number,default:0},
    rent:{type:Number,default:0},
    houseHold:{type:Number,default:0},
    cloth:{type:Number,default:0},
    food:{type:Number,default:0},
    groceries:{type:Number,default:0},
    other:{type:Number,default:0},

    dailyExpenses: {
        type: [Number], // Array to store expenses for each day
        default: Array(31).fill(0), // Initialize with 31 days, all set to 0
      },
    currentMonths:[{
        type:mongoose.Schema.Types.ObjectId, ref:"currentMonth"
    }],
    PrevMonths:[{
        type:mongoose.Schema.Types.ObjectId, ref:"currentMonth"
    }],
}

, {
    collection: 'user-data'
});

const UserModel = mongoose.model('User', userSchema);
export default UserModel;