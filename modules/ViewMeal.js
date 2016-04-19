import React from 'react'
import {Link, browserHistory} from 'react-router'
import Meal from './Meal'
import {Grid,Row,Col, Input, Button, Alert} from 'react-bootstrap'

export default React.createClass({

  handleSearch(event) {
    event.preventDefault()
    const recipe_search = {
      "cuisine":event.target.elements[0].value,
      "diet":event.target.elements[1].value || 'vegetarian',
      "excludeIngredients":event.target.elements[2].value,
      "intolerance":event.target.elements[3].value,
      "limitLicense":false,
      "number":10,
      "offset":0,
      "type":event.target.elements[4].value,
      "query":event.target.elements[5].value
    }
    $.ajax({
      url: '/api/recipes',
      cache:false,
      type:'POST',
      data:recipe_search,
      dataType:'JSON',
      success: function(data) {
        const recipes = data.results
        if (recipes.length != 0) {
          if(this.state.username != null) {
            recipes.forEach(recipe => {
              recipe.username = this.state.username
            })
          }
          this.setState({recipes:recipes})
        } else {
          this.setState({showAlert:true})
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
      }.bind(this)
    })
  },

  loadMealsFromServer() {
    $.ajax({
      url: '/api/recipes',
      type:'GET',
      dataType:'JSON',
      cache:false,
      success: function(data) {
        const recipes = data.results
        if (recipes.length != 0) {
          if(this.state.username != null) {
            recipes.forEach(recipe => {
              recipe.username = this.state.username
            })
          }
          this.setState({recipes:recipes})
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    })
  },

  getInitialState() {

    var filters = [{"name":"cuisine","placeholder":"chinese","instruction":"The cuisine(s) of the recipes. One or more (comma separated) of the following: african, chinese, japanese, korean, vietnamese, thai, indian, british, irish, french, italian, mexican, spanish, middle eastern, jewish, american, cajun, southern, greek, german, nordic, eastern european, caribbean, or latin american."},
                   {"name":"diet","placeholder":"vegetarian","instruction":"The diet to which the recipes must be compliant. Possible values are: pescetarian, lacto vegetarian, ovo vegetarian, vegan, and vegetarian."},
                   {"name":"exclude","placeholder":"coconut","instruction":"An comma-separated list of ingredients or ingredient types that must not be contained in the recipes."},
                   {"name":"intolerance","placeholder":"egg, gluten","instruction":"A comma-separated list of intolerances. All found recipes must not have ingredients that could cause problems for people with one of the given tolerances. Possible values are: dairy, egg, gluten, peanut, sesame, seafood, shellfish, soy, sulfite, tree nut, and wheat."},
                   {"name":"type","placeholder":"main course","instruction":"The type of the recipes. One of the following: main course, side dish, dessert, appetizer, salad, bread, breakfast, soup, beverage, sauce, or drink."}
                  ]
    return {
            recipes:[],
            filters:filters,
            username:this.props.params.username,
            showAlert:false
          }
  },

  componentDidMount() {
    this.loadMealsFromServer()
  },

  handleAlertDismiss() {
    this.setState({showAlert:false})
  },

  render() {
    
    var rows = this.state.recipes.map((recipe, i) => {
      return (<Meal item={recipe} key={recipe.id} />)
    })

    var types = this.state.filters.map((filter, i) => {
      return (
        <Row key={i}>
          <Row>
            <Col xs={3} md={3} className="filter-name-col">
              <Row className="filter-name">{filter.name}</Row>
              <Row className="filter-input-type">STRING</Row>
            </Col>
            <Col xs={8} md={8} classNam="filter-input">
              <Input type="text" name={filter.name} placeholder={filter.placeholder} />
            </Col>
          </Row>
          <Row>
            <Col xs={3} md={3}></Col>
            <Col xs={8} md={8} className="filter-instruction">
              {filter.instruction}
            </Col>
          </Row>
        </Row>
        )
    })

    const alertInstance = (
      <Alert bsStyle="warning" dismissAfter={3000} onDismiss={this.handleAlertDismiss}>
        <strong>Sorry! We did not find recipes that match your filters</strong>
      </Alert>
    )


    var gridInstance = (
      
      <Grid>
      {this.state.showAlert == true ? alertInstance : null}
      <form onSubmit={this.handleSearch}>
        <Row className="view-meal-page">
          
          <Col xs={4} md={4} className="filter-left-col">
            <div className="filter">
              <Row>
                <Col xs={3} md={3} className="filter-input">
                  <div className="filter-title">Filter</div>
                </Col>
              </Row>
              {types}
            </div>
          </Col>
          <Col xs={8} md={8} className="meals">
            <div > 
              
                <Input type="text" className="search-input" placeholder="Have a food name in mind?"/>
                <Button type="submit" className="search-btn">Find Recipes</Button>
                
                {this.state.recipes.map((recipe) => {
                  return (<Meal item={recipe} key={recipe.id} />)
                })}

            </div>
          </Col>
        </Row>
      </form>
      </Grid>
    )

    return gridInstance
  }
})