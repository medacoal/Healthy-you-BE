import User from "../models/user.js";




// getAllUsers (by admin only)
export const getAllUsers = async (req, res) => {
    try {
        // Ensure the request is made by an admin
        if (!req.user.isAdmin) {
            return res.status(403).json({ success: false, message: "Access denied." });
        }

        const users = await User.find().select("name email isAgent isAdmin _id");
        res.status(200).json({ success: true, data: users });
    } catch (err) {
        console.error("Error fetching users:", err.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// getUserById
export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.status(200).json({ success: true, data: user });
    } catch (err) {
        console.error("Error fetching user by ID:", err.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
