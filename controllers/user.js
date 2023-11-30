const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { JWT_SECRET } = require("../config");
const PasswordReset = require("../models/password");

const userController = {
    
    signup: async (req, res) => {
        const { name, email, password } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                const passwordHash = await bcrypt.hash(password, 10);

                const newUser = new User({
                    name,
                    email,
                    passwordHash
                });

                await newUser.save();
                return res.status(200).json({ message: "User created successfully", newUser });
            }

            return res.status(500).json({ message: "Email already exists please login" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" ,error});
        }
    },

    signin: async (req, res) => {
        
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
            return res.status(404).json({ message: "Password is wrong" });
        }

        const token = jwt.sign({ email }, JWT_SECRET);

        return res.status(200).json({ message: "Login successfully ", token, user });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error",error });
        }

    },

    resetPassword: async (req, res) => {
        try {
         const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const randomString = Math.random().toString(36).substring(7);

        await PasswordReset.create({
            email,
            randomString
        });

        user.randomString=randomString;
        await user.save();
            
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: '143.lovvable@gmail.com',
                pass: 'fnmxhibtwjgdzajq'
            },
        });

        const message = {
        from: '143.lovvable@gmail.com',
        to: email,
        subject: 'Password Reset Link',
        text:`You are requested to change the password of user login ,So please enter this otp key = ${randomString}`
        }

        transporter.sendMail(message, (err, info) => {
            if (err) {
                res.status(404).json({ message: "something went wrong,try again !" });
            }
            res.status(200).json({ message: "Email sent successfully" , info });
        })
        } catch (error) {
             console.error(error);
            res.status(500).json({ message: "Internal Server Error",error });
        }
    },

    newPassword: async (req, res) => {
        try {
            const { randomString, newPassword } = req.body;

            const stringMatches = await PasswordReset.findOne({ randomString }) || await User.findOne({randomString});

            if (!stringMatches) {
                return res.status(500).json({ message: "OTP is Incorrect" });
            }

            const passwordHash = await bcrypt.hash(newPassword, 10); 

            const user = await User.findOneAndUpdate(
                { email: stringMatches.email },
                { $set: { passwordHash } },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            await PasswordReset.deleteOne({ email: stringMatches.email, randomString }); 
            user.randomString = "NULL";
            await user.save();

            return res.status(200).json({ message: 'Password reset successful' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error", error });
        }
    },

    allusers: async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json({ message: "All users are fetched successfullly" ,users});
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error", error });
        }
    },

};

module.exports = userController;
