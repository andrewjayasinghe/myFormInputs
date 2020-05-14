const RequestService = require('../Services/RequestService');

exports.Index = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    return res.render('Home/Index', { reqInfo:reqInfo });
};

exports.About = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    return res.render('About/Index', { reqInfo:reqInfo });
};

exports.Construct = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    return res.render('Movies/MyReviews', { reqInfo:reqInfo });
};
