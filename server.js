import express from 'express'
import React from 'react'
import jQuery from 'jquery'
import unirest from 'unirest'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import router from './modules/routes'
import routes from './routes.json'
import path from 'path'
import compression from 'compression'
import bodyParser from 'body-parser'
import fs from 'fs'
import USERS from './users.json'

//dev purpose
import standard_target from './standard_target.json'
import resultBody from './resultBody.json'
import singleRecipe from './singleRecipe.json'

var NutritionixClient = require('nutritionix');
var nutritionix = new NutritionixClient({
	appId: '0a93c2f5',
	appKey: '4659bb399609d5d3db4713b22d75b3b2'
});


var app = express()

app.use(compression())

var USERS_FILE = path.join(__dirname, 'users.json');
var MEALS_FILE = path.join(__dirname, 'meals.json');

//static files
app.use(express.static(path.join(__dirname,'public')))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Disable caching
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.post('/auth/login', function(req,res) {
	const usr = req.body.username
	const pwd = req.body.password
	var valid = false
	USERS.forEach(user => {
		if(user.username == usr && user.password == pwd) valid = true
	})
	if(valid) {
		res.send({status:false})
	} else {
		res.send({status:true})
	}
});

app.post('/auth/register', function(req,res) {
	const usr = req.body.username
	const pwd = req.body.password
	const email = req.body.email
	fs.readFile(USERS_FILE, function(err, data) {
	    if (err) {
	      console.error(err);
	      process.exit(1);
	    }
	    var users = JSON.parse(data);
	    // NOTE: In a real implementation, we would likely rely on a database
	    var newUser = {
	      username:usr,
	      password:pwd,
	      email:email,
	      history:[],
	      profile:{}
	    };
	    users.push(newUser);
	    fs.writeFile(USERS_FILE, JSON.stringify(users, null, 1), function(err) {
	      if (err) {
	        console.error(err);
	        process.exit(1);
	      }
	      res.json(users);
	    });
  	});
});

app.post('/user/profile', function(req, res) {
	const usr = req.body.username
	fs.readFile(USERS_FILE, function(err, data) {
	    if (err) {
	      console.error(err);
	      process.exit(1);
	    }
	    var users = JSON.parse(data);
	    // NOTE: In a real implementation, we would likely rely on a database
	    users.forEach(user => {
			if(user.username == usr) {
				if(user.profile.target_nutrients == null) {
					user.profile.target_nutrients = standard_target
				}
				for (var field in req.body.profile) {
					user.profile[field] = req.body.profile[field]
				}
			}
		})
	    fs.writeFile(USERS_FILE, JSON.stringify(users, null, 1), function(err) {
	      if (err) {
	        console.error(err);
	        process.exit(1);
	      }
	      console.log(USERS)
	      res.json(users);
	    });
  	});
})

app.post('/api/addFood', function(req,res) {
	var empty_nutrients = [{"name": "Calories"},{"name": "Fat"},{"name": "Protein"},{"name": "Carbs"},{"name": "Sugar"},{"name": "Sodium"},{"name": "Calcium"},{"name": "Fiber"},{"name": "Vitamin C"}]
	const usr = req.body.username
	fs.readFile(USERS_FILE, function(err, data) {
	    if (err) {
	      console.error(err);
	      process.exit(1);
	    }
	    var users = JSON.parse(data);
	    // NOTE: In a real implementation, we would likely rely on a database
	    users.forEach(user => {
			if(user.username == usr) {
				var found = false
				user.history.forEach(history => {
					if(history.date == req.body.date) {
						found = true
						history.food.push({name:req.body.title,field:req.body.title})
						history.nutrients_intake.map(nutrient => {
							var match_nutrient = false
							req.body.nutrients.map(added_nutrient => {
								if(added_nutrient.title == nutrient.name) {
									match_nutrient = true
									if(nutrient[req.body.title]) {
										nutrient[req.body.title] += parseFloat((added_nutrient.percentOfDailyNeeds/100).toFixed(2))
									} else {
										nutrient[req.body.title] = parseFloat((added_nutrient.percentOfDailyNeeds/100).toFixed(2))
									}
								}
								if(added_nutrient.title == 'Carbohydrates' && nutrient.name == 'Carbs') {
									if(nutrient[req.body.title]) {
										nutrient[req.body.title] += parseFloat((added_nutrient.percentOfDailyNeeds/100).toFixed(2))
									} else {
										nutrient[req.body.title] = parseFloat((added_nutrient.percentOfDailyNeeds/100).toFixed(2))
									}
								}
							})
							if (!match_nutrient) nutrient[req.body.title] = 0
						})
					}
				})
				if (!found) {
					empty_nutrients.map(n => {
						req.body.nutrients.map(added_nutrient => {
							if(added_nutrient.title == n.name) {
								n[req.body.title] = parseFloat((added_nutrient.percentOfDailyNeeds/100).toFixed(2))
							}
							if(added_nutrient.title == 'Carbohydrates' && n.name == 'Carbs') {									
									n[req.body.title] = parseFloat((added_nutrient.percentOfDailyNeeds/100).toFixed(2))
								}
						})
					})
					var new_history = {
						date:req.body.date,
						food:[{name:req.body.title,field:req.body.title}],
						nutrients_intake: empty_nutrients
					}
					user.history.push(new_history)
				}
			}
		})
		fs.writeFile(USERS_FILE, JSON.stringify(users, null, 1), function(err) {
	      if (err) {
	        console.error(err);
	        process.exit(1);
	      }
	      console.log(USERS)
	      res.json(users);
	    });
  	});
})

app.get('/api/profile/:username',function(req,res) {
	const usr = req.params.username
	fs.readFile(USERS_FILE, function(err, data) {
	    if (err) {
	      console.error(err);
	      process.exit(1);
	    }
	    var users = JSON.parse(data);
	    // NOTE: In a real implementation, we would likely rely on a database
	    users.forEach(user => {
			if(user.username == usr) {
				res.json(user)
			}
		})
  	});
})

app.post('/api/recipes', function(req, res) {
	var url = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?'
	for (var field in req.body) {
		if(req.body[field] != '') {
			url += field + '=' + encodeURIComponent(req.body[field]) + '&'
		}
	}
	url = url.slice(0, -1)
	unirest.get(url)
	.header("X-Mashape-Key", "mBmK1guETymshcqWZUhL9BF9bsw6p1oGGbSjsnKpivHrGN03fF")
	.end(function (result) {
	  console.log(result.status, result.headers, result.body);
	  res.json(result.body)
	});
});

app.get('/api/recipes', function(req, res) {
	unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?diet=vegetarian&limitLicense=false&number=10&offset=0&query=any&type=main+course")
	.header("X-Mashape-Key", "mBmK1guETymshcqWZUhL9BF9bsw6p1oGGbSjsnKpivHrGN03fF")
	.end(function (result) {
	  res.json(result.body)
	});
})

app.get('/api/recipe/:recipe_id', function(req,res) {
	var url = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/"+ req.params.recipe_id + "/information?includeNutrition=true"
	unirest.get(url)
	.header("X-Mashape-Key", "mBmK1guETymshcqWZUhL9BF9bsw6p1oGGbSjsnKpivHrGN03fF")
	.end(function (result) {
	  console.log(result.status, result.headers, result.body);
	  res.json(result.body)
	});

})

app.get('/api/search/:query', function(req,res) {
	nutritionix.search({
		q:req.params.query,
		limit:20,
		offset:0,
		search_nutrient: 'calories'
	}).then(function(items) {
		if(items.results) {
			res.send({status:200,results:items.results});	
		} else {
			res.send({status:404})
		}		
	}, function(err) {
		console.log(err);
	}).catch(function() {});
})

app.get('/api/meal/:foodId', function(req,res) {
	nutritionix.item({
	    id: req.params.foodId
	}).then(function(item) {
		// console.log(item);
		res.send(item);
	},function(err) {
		console.log('err');
	}).catch(function(err) {
		console.log('catch');
	});
});

// send all requests to index.html so browserHistory in React Router works
routes.forEach(route => {
	app.get(route.path, (req,res) => {
		res.sendFile(path.join(__dirname, 'public', 'index.html'))
		// match the routes to the url
		// match({routes:router, location:req.url}, (err, redirect,props)  => {
		// 	// in here we can make some decisions all at once
		//     if (err) {
		//       // there was an error somewhere during route matching
		//       res.status(500).send(err.message)
		//     } else if (redirect) {
		//       // we haven't talked about `onEnter` hooks on routes, but before a
		//       // route is entered, it can redirect. Here we handle on the server.
		//       res.redirect(redirect.pathname + redirect.search)
		//     } else if (props) {
		//       // if we got props then we matched a route and can render
		//       const appHtml = renderToString(<RouterContext {...props}/>)
		//       res.send(renderPage(appHtml))
		//     } else {
		//       // no errors, no redirect, we just didn't match anything
		//       res.status(404).send('Not Found')
		//     }
		// })
	})
})

function renderPage(appHtml) {
	return `
		<!doctype html public="storage">
		<html>
		<meta charset=utf-8/>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css">
		<link rel="stylesheet" href="/style/style.css">
		<title>Veggie</title>
		<div id=root>${appHtml}</div>
    	<script src="/bundle.js"></script>
    	`
}


var PORT = process.env.PORT || 8000
app.listen(PORT, function() {
  console.log('Production Express server running at localhost:' + PORT)
})