import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Root from './Root'
import About from './About'
import ViewMeal from './ViewMeal'
import Register from './Register'
import Login from './Login'
import Home from './Home'
import Detail from './Detail'
import Profile from './Profile'
import User from './User'

module.exports = (
  <Route path="/" component={Root}>
    <IndexRoute component={Home}/>
    <Route path="/view-meal" component={ViewMeal}/>
    <Route path="/view-meal/:username" component={ViewMeal}/>
    <Route path="/recipe/:recipe_id" component={Detail}/>
    <Route path="/recipe/:recipe_id/:username" component={Detail}/>
    <Route path="/profile/:username" component={Profile}/>
    <Route path="/user/:username" component={User}/>
    <Route path="/register" component={Register}/>
    <Route path="/login" component={Login}/>
  </Route>
)