import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const auth = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  try {
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
  } catch (error) {
    res.status(500).json(error.message);
  }
  res.status(201).send("user is created successfully!");
};
