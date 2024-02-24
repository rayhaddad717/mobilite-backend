import express from "express";
import bcrypt from "bcrypt";
import Admins from "../models/AdminModel";
const router = express.Router();
//EXPORT TO EXCEL
router.post("/login", async (req, res) => {
  try {
    const { password, username } = req.body;
    console.log(req.body);
    const admin = await Admins.findOne({
      where: {
        username,
      },
    });
    if (!admin) {
      return res.status(401).json({ unauthorized: true });
    }
    const userStoredHashedPassword = admin.password_hash; // You should retrieve this from your database

    // Compare submitted password with the stored hashed password
    const match = await bcrypt.compare(password, userStoredHashedPassword);
    if (match) {
      // Passwords match
      res.cookie("isLoggedIn", true, {
        httpOnly: true,
        secure: false,
        maxAge: 3600000,
      }); // Secure: true is recommended for HTTPS
      res.send("Login successful");
    } else {
      // Passwords don't match
      res.status(400).send("Incorrect password");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in");
  }
});

router.get("/logout", function (req, res) {
  res.cookie("isLoggedIn", "", { expires: new Date(0) });
  res.send("User logged out");
});

export default router;
