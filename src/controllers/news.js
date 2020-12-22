const {
    News,
    validate
} = require('../models/news');
const { Account } = require('../models/account');

module.exports = {

    createNews: async function (req, res) {
        try {
            const { error } = validate(req.body);
            if (error) return res.status(400).send(error.details[0].message);
            news = new News(req.body);
            await news.save();
            await Account.findOneAndUpdate({ email: req.userEmail }, { $addToSet: { news: [news._id] } });
            res.status(200).send(news);
        } catch (e) {
            console.log(e);
            return res.status(404).send(e);
        }
    },
    getCoachNews: async function (req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            account = await Account.findOne({ email: req.userEmail })
            const news = [];
            for (let i = (page - 1) * limit; i < account.news.length && i < page * limit; i++) {
                const oneNews = await News.findById(account.news[i]);
                news.push(oneNews);
            }
            res.status(200).send(news);
        } catch (ex) {
            return res.status(404).send(ex)
        }
    },
    deleteNews: async function (req, res) {
        try {
            account = await Account.findOne({ email: req.userEmail })
            if (account.news.indexOf(req.params.newsId) == -1)
                return res.status(404).send('A news with the given ID was not found');
            account.news.pull(req.params.newsId);
            await account.save();
            const news = await News.findOneAndDelete({ _id: req.params.newsId });
            res.send(news);
        } catch (e) {
            res.status(500).send('Error occurred');
            console.log(e);
        }
    }
}