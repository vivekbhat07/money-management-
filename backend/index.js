import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import UserModel from "./models/userModel.js";
import currentMonth from "./models/currentMonth.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

mongoose
  .connect("mongodb://localhost:27017/money-management", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
function isLoggedin(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = jwt.verify(token, "vivek");
    req.user = user;
    next();
  } catch (error) {
    console.log("hello world");
    res.status(403).json({ error: "Invalid token" });
  }
}

//signin
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const user = await UserModel.create({ name, email, password });

    const token = jwt.sign({ name: user.name, email: user.email }, "vivek", {
      expiresIn: "1h",
    });

    res.cookie("token", token);
    res.status(201).json({ status: "ok", user });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});
app.get("/api/data/:id", async (req, res) => {
  try {
    const expense = await currentMonth.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// User Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await UserModel.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ name: user.name, email: user.email }, "vivek", {
      expiresIn: "1h",
    });

    res.cookie("token", token);
    res.json({ status: "ok", user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});
app.post("/api/transactions", isLoggedin, async (req, res) => {
  const { date, amount, type, description } = req.body;

  // Validate required fields
  if (!date || !amount || !type || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Create the transaction in the database
    const expense = await currentMonth.create({
      date,
      amount,
      Etype: type,
      description,
    });

    // Find the user by their authenticated email
    const user = await UserModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const selectdate = new Date(date);
    const day = selectdate.getDate();
    // Update user's current month transactions
    user.dailyExpenses[day - 1] += amount;
    user.currentMonths.push(expense._id); // Assuming `currentMonth` is an array of transaction IDs
    user.totalCurrnetExpense += amount; // Increment total current expense
    switch (type) {
      case "rent":
        user.rent = user.rent + amount;
        break;
      case "cloth":
        user.cloth = user.cloth + amount;
        break;
      case "food":
        user.food = user.food + amount;
        break;
      case "houseHold":
        user.houseHold = user.houseHold + amount;
        break;
      case "groceries":
        user.groceries = user.groceries + amount;
        break;
      case "other":
        user.other = user.other + amount;
        break;
      default:
      // Code block for all other values
    }

    // Save the updated user data
    await user.save();

    // Respond with success
    res.status(201).json({
      message: "Transaction added successfully",
      transaction: expense,
    });
  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

app.get("/api/getExpense", isLoggedin, async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.user.email }).populate();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(user.currentMonths);

    res.json({
      user: user,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});
app.delete("/api/delete/:id", isLoggedin, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findOne({ email: req.user.email });
    console.log(id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
      console.log("hi");
    }

    // Filter out the transaction with the given id from currentMonths
    const updatedCurrentMonths = user.currentMonths.filter(
      (transactionId) => transactionId !== id
    );
    user.currentMonths = updatedCurrentMonths;

    // Save the updated user
    await user.save();

    // Delete the transaction from the currentMonth collection
    const deletedTransaction = await currentMonth.findByIdAndDelete(id);

    if (deletedTransaction) {
      res.status(200).send({ message: "Transaction deleted successfully!" });
    } else {
      res.status(404).send({ error: "Transaction not found" });
    }
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).send({ error: "Server error, please try again later." });
  }
});

app.get("/get/user", isLoggedin, async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(user.currentMonths);

    res.json({
      user: user.name,
      login: true,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});
app.post("/logout", (req, res) => {
  res.clearCookie("token"); // Clear the authentication token from cookies
  res.status(200).send({ message: "Logged out successfully" });
});

const port = 5000;

app.listen(port, console.log("runningg sucessfully"));
