# Frodo

Frodo is a Rails-like app generator for Node and Express. It was created to simplify working
with projects based on the Express framework. Nowadays, many developers are familiar with the Ruby on Rails
framework, which helps you generate a structure for your app. An app generated with Frodo will help you in the same way.

**Motivation:**
  * I use Rails a lot and I love how Rails apps are organized
  * It can be difficult to start with a micro-framework like Express without a predefined structure.
    Frodo will help developers using Node/Express to create a new app as fast as possible.


## Documentation:

#### Installation
  * clone repository  
  * add Frodo to the PATH environment variable

```shell
$ cd /dicrecory/you/like
$ git clone https://github.com/leemalmac/frodo.git
```

After the repository has been cloned, add the Frodo executable to the PATH. Personally, I prefer to make an alias into /usr/local/bin.

```shell
$ sudo ln -s /path/to/frodo/executable /usr/local/bin/frodo
```

Done. Now you can easily invoke the Frodo command line tool.

#### Usage:
Frodo has a command line interface like Rails, but, for now, Frodo has support for a very limited set of actions. You are able to:
```
- create a new application
- generate controller/model or scaffold
```

To create a new application use 'new' followed by application name:
```shell
$ frodo new blog
```

This command will create a new project with a predefined folders structure.

If you want to build an API, and you don't need views or static files, use the `--skipViews` optional argument.
```shell
$ frodo new api --skipViews
```

**Generators**

Like in Rails, Frodo can create a controller, a model, or a combination of both with a scaffold.

Generating a controller
```shell
$ frodo generate controller user [methods]
```
This command creates an empty controller in the app/controllers folder, which
should look like this:
```javascript
// users_controller.js
var UsersController = (function () {
  return {
  }
}());

module.exports = UsersController;
```
and corresponding static files users.css and users.js in app/assests/stylesheets and app/assets/javascripts respectively.

You can also write a list of methods separated by whitespaces.
```shell
$ frodo generate controller user new show
```
this produces:
```javascript
// users_controller.js
var UsersController = (function () {
  return {
	new: function (req, res) {},
    show: function (req, res) {}
  }
}());
```
and creates corresponding the views.

Generating a model:
```shell
$ frodo generate model user name age
```
produces:
```javascript
var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId,
    Mixed = Schema.Types.Mixed;

var UserSchema = mongoose.Schema({
  name: {type: String, required: true},
  age: {type: Number, required: true},
  created_at: {type: Number, required: true, default: new Date().getTime()},
  updated_at: {type: Number, required: true, default: new Date().getTime()}
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
```

At the moment, Frodo supports only mongoose for defining models.
