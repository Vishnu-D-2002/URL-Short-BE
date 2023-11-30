const URL_Short = require("../models/url");

const urlController = {
    urlLong: async (req, res) => {
        try {
            const originalURL = req.body.originalURL; 

            let url = await URL_Short.findOne({ originalURL });

            if (!url) {
                url= new URL_Short({ originalURL });
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
