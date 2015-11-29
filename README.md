# Frodo

Frodo is a Rails-like app generator for Node and Express. It was created to simplify work
with projects based on Express framework. Nowadays, many developers are familiar with Ruby on Rails
framework, so app generated with Frodo will help you to kickstart faster.

**Motivation:**
  * I use Rails a lot and I love how Rails apps are organized
  * Sometimes, it is difficult to start with a micro-framework like Express without predefined structure.
    I want to help developers who begin using Node/Express to create a new app as fast as possible.


## Documentation:

#### Installation
For now installation process follows several steps:  
  * clone repository  
  * add frodo to the PATH environment variable

```shell
$ cd /dicrecory/you/like
$ git clone https://github.com/leemalmac/frodo.git
```

After the repository has been cloned, add frodo executable to the PATH. Personally, I prefer to make an alias into /usr/local/bin.

```shell
$ sudo ln -s /path/to/frodo/executable /usr/local/bin/frodo
```

Done. Now you can easily invoke frodo command line tool.

#### Usage:
Frodo has a command line interface like rails has.
To the moment frodo support very limited set of actions. You are able to:
```
- create a new application
- generate controller/model or scaffold
```

To create a new application use 'new' followed by application name:
```shell
$ frodo new blog
```

This command create a new project with predefined folders structure. Again, the folders structure is very similar to Rails projects.  

If you want to build an api, and you don't need views and static files, use --skipViews optional argument.
```shell
$ frodo new api --skipViews
```

**Generators**

Like in Rails, frodo can create a controller, a model or a combenation of both with scaffold.

Generating controller
```shell
$ frodo generate controller user [methods]
```
This command creates an empty controller in app/controllers folder, which
should looks like:
```javascript
// users_controller.js
var UsersController = (function () {
  return {
  }
}());

module.exports = UsersController;
```
and corresponding static files users.css and users.js in app/assests/stylesheets and app/assets/javascripts respectively.

You can specify a list of methods separated by whitespaces.
```shell
$ frodo generate controller user new show
```
produces
```javascript
// users_controller.js
var UsersController = (function () {
  return {
	new: function (req, res) {},
    show: function (req, res) {}
  }
}());
```
and creates corresponding views, if --skipViews was not applied.

Generating model
```shell
$ frodo generate model user name age
```
produces
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

At the moment - frodo supports only mongoose for defining models.
