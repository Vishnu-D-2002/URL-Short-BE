const shortid = require("shortid");
const URL_Short = require("../models/url");

const urlController = {
    urlLong: async (req, res) => {
        try {
            const { longURL } = req.body;

            let url = await URL_Short.findOne({ longURL });

            if (!url) {
                const shortURL = `/${shortid.generate()}`;
                url = new URL_Short({ longURL, shortURL });
                await url.save();
                res.status(200).json({ message: "New long URL saved", shortURL });
            } else {
                res.status(200).json({ message: "URL already exists", shortURL: url.shortURL });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error", error });
        }
    },

    getRedirect: async (req, res) => {
    try {
        const { shortString } = req.params;

        const url = await URL_Short.findOne({ shortURL: `/${shortString}` });

        if (url) {
            // Redirect to the original long URL using status code 307
            res.status(307).redirect(url.longURL);
        } else {
            res.status(404).json({ message: "URL not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
    },
    
};

module.exports = urlController;
