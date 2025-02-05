import User from "../models/user.js";
import { hashPassword } from "../helpers/index.js";
import jwt from "jsonwebtoken"; // for token generation
import { comparePassword } from "../helpers/index.js";


export const register = async (req, res) => {
    try{
        const { fullName, email, password } = req.body;
        // console.log(req.body);
        
//handle validation
if(!fullName){
    return res.status(400).json({ success: false, message: 'Full Name is required'});
}

//create new user
if(!email){
    return res.status(400).json({ success: false, message: 'email is required'});
}
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    return res.status(400).json({ success: false, message: 'Invalid email format'});
}
if(!password) {
    return res.status(400).json({ success: false, message: 'password is required'});
}
if(password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password should be at least 6 characters long'});
}

//check if email already exists
const userExists = await User.findOne({ email });
if(userExists) {
    return res.status(400).json({ success: false, message: 'Email already exists'});
}

//create new user

if(!fullName || !email || !password){
    return res.status(400).json({ success: false, message: 'All fields are required'} )
}
    



// hashing user's password
const hashedPassword = await hashPassword(password);


//create a new user
const user = new User({
    fullName,
      email, 
      password: hashedPassword,
    });


//save the user to the database
await user.save();

// Generate a token
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// send response

       // Send response
    return res.json({ success: true, message: "Registration successful", user: {
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token
    }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Registration failed", error: err });
  }
};




// Login

export const login = async (req, res) => {
    try { 
        const { email, password } = req.body;

        // Check if username is provided
        if (!email) {
            return res.status(400).json({ success: false, message: 'Username is required' });
        }

        // Check if password is provided
        if (!password) {
            return res.status(400).json({ success: false, message: 'Password is required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        

        // Now, use your imported comparePassword function to verify the password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate a token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2days" });

        // Send response with user details and token
        return res.json({
            success: true,
            message: "Login successful",
            user: {
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                token
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Login failed', error: err });
    }
};
