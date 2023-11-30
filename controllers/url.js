const URL_Short = require("../models/url");

const urlController = {
    urlLong: async (req, res) => {
        try {
            const longURL = req.body.longURL; 

            let url = await URL_Short.findOne({ longURL });

            if (!url) {
                url= new URL_Short({ longURL });
                await url.save();
                res.status(200).json({ message: "New long URL saved" });
            } else {
                res.status(200).json({ message: "URL already exists" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error", error });
        }
    },
};

module.exports = urlController;
