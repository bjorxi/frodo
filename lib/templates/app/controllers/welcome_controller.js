var WelcomesController = (function () {
  return {
    index: function (req, res) {
      res.render('welcome/index');
    }
  }
}());

module.exports = WelcomesController;
