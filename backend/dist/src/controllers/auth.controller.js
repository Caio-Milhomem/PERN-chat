import prisma from "../db/prisma.js";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken.js";
export const signup = async (req, res) => {
    try {
        const { fullName, userName, password, confirmPassword, gender } = req.body;
        if (!fullName || !userName || !password || !confirmPassword || !gender) {
            return res.status(400).json({ error: "Please fill in all the fields" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }
        const user = await prisma.user.findUnique({ where: { userName } });
        if (user) {
            return res.status(400).json({ error: "Username already exists" });
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${userName}`;
        const newUser = await prisma.user.create({
            data: {
                fullName,
                userName,
                password: hashedPassword,
                gender,
                profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
            },
        });
        if (newUser) {
            generateToken(newUser.id, res);
            res.status(201).json({
                id: newUser.id,
                fullName: newUser.fullName,
                userName: newUser.userName,
                profilePic: newUser.profilePic,
            });
        }
        else {
            res.status(400).json({ error: "Invalid user data" });
        }
    }
    catch (error) {
        console.log("Error in singup controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const login = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const user = await prisma.user.findUnique({ where: { userName } });
        if (!user) {
            return res.status(400).json({ error: "Invalid username" });
        }
        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid password" });
        }
        generateToken(user.id, res);
        res.status(200).json({
            message: "Login successful",
            id: user.id,
            fullName: user.fullName,
            userName: user.userName,
            profilePic: user.profilePic,
        });
    }
    catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const logout = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "User is not logged in" });
        }
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out sucessfully" });
    }
    catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({
            id: user.id,
            fullName: user.fullName,
            userName: user.userName,
            profilePic: user.profilePic,
        });
    }
    catch (error) {
        console.log("Error in getMe controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
