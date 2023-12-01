const shortid = require("shortid");
const URL_Short = require("../models/url");
const User = require("../models/user");

const urlController = {
    urlLong: async (req, res) => {
        try {
            const { longURL } = req.body;

            let userId = req.userId;

            let url = await URL_Short.findOne({ longURL });

            const user = await User.findById({ _id: userId });
            if (!url) {
                const shortURL = `/${shortid.generate()}`;
                url = new URL_Short({ longURL, shortURL, userId });
                user.total_URLs += 1;
                await url.save();
                await user.save();
                return res.status(200).json({ message: "New long URL saved", shortURL });
            } else {
                return res.status(200).json({ message: "URL already exists", shortURL: url.shortURL });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error", error });
        }
    },

    getRedirect: async (req, res) => {
    try {
        const { shortString } = req.params;

        const url = await URL_Short.findOneAndUpdate(
        { shortURL: `/${shortString}` },
        {
            $push: { visitHistory: { timestamp: Date.now() } }
        },
        { new: true }
        );

        if (url) {
            url.totalClicks = url.visitHistory.length;
            await url.save();
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
    
    deleteURL: async (req, res) => {
    try {
        const userId = req.userId;
        const { shortString } = req.params;

        const deletedURL = await URL_Short.findOneAndDelete({ shortURL: `/${shortString}`, userId: userId });

        if (deletedURL) {
            // Decrement the total URLs for the user
            await User.findByIdAndUpdate(userId, { $inc: { total_URLs: -1 } });

            return res.status(200).json({ message: "URL deleted successfully" });
        } else {
            return res.status(404).json({ message: "URL not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
    }

};

module.exports = urlController;
