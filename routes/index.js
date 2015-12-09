/**
 * Created by aparnalingam on 8/4/15.
 */


module.exports = function(app) {

  //which ever method require authentication include this
  function requireAuthentication(req, res, next) {


  }

  var indexRouter = require('../src/controllers/indexController');
    app.get('/', indexRouter.renderIndexPage);

};
