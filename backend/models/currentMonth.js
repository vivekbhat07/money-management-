import mongoose from "mongoose";

const currentMonthSchema=new mongoose.Schema({
    amount:{type:Number,required:true},
    Etype:{type:String, required:true},
    description:{type:String},
    date:{type:Date, required:true},
},
    {collection:'CurrentMonth'

})

const currentMonth = mongoose.model('currentMonth', currentMonthSchema);

export default currentMonth;
