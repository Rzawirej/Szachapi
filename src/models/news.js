const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const newsSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 1,
        maxlength: 64,
        required: true
    },
    text: {
        type: String,
        minlength: 1,
        maxlength: 1000,
        required: true
    }
});
const News = mongoose.model('News', newsSchema, 'News');

function validateNews(news) {
    const schema = Joi.object({
        name: Joi.string().min(1).max(64).required(),
        text: Joi.string().min(1).max(1000).required(),
    })
    return schema.validate(news);
}

exports.newsSchema = newsSchema;
exports.validate = validateNews;
exports.News = News;