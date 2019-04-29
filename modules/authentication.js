var Authentication = {};



Authentication.isAdmin = function(req, res, next) {
  if (req.user.isAdmin){
    return next();
  } else {
    res.redirect('/');
  }
}
module.exports = Authentication;
