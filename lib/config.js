module.exports = {
  appname: null,

  set: function (props) {
    for (var key in props) {
      this[key] = props[key];
    }
  }
};
