const URL_Short = require("../models/url");
const User = require("../models/user");

const urlController = {
    urlLong: async (req, res) => {
        try {
            const {longURL} = req.body; 

            const userId = req.userId;
            const user = await User.findById(userId);
            if(user){
            
                let url = await URL_Short.findOne({ longURL });

            if (!url) {
                url= new URL_Short({ longURL });
                await url.save();
                res.status(200).json({ message: "New long URL saved" });
            } else {
                res.status(200).json({ message: "URL already exists" });
                }
            }
            return res.status(500).json({ message: "User not Found" });
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error", error });
        }
    },
};

module.exports = urlController;
