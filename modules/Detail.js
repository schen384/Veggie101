import React from 'react'
import {Link, browserHistory} from 'react-router'
import moment from 'moment'
import {Grid,Row,Col, Input, Button, Image, Table} from 'react-bootstrap'
import NutrientRow from './NutrientRow'

export default React.createClass({

  loadDetailFromServer() {
    console.log(this.props.params.recipe_id)
    $.ajax({
        url: '/api/recipe/'+this.props.params.recipe_id,
        dataType:'json',
        cache:false,
        success: function(data) {
          var tags = ["vegetarian","vegan","glutenFree","dairyFree","sustainable","veryHealthy"];
          var true_tags = [];
          for(var ind = 0;ind < tags.length;ind++) {
            if(data[tags[ind]] == true) true_tags.push(tags[ind])
          }


          this.setState({
                          recipe:data,
                          tags:true_tags,
                          img:data.image,
                          sourceUrl:data.sourceUrl,
                          name:data.title,
                          ingredients:data.nutrition.ingredients,
                          nutrients:data.nutrition.nutrients
                        });
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      })
  },

  handleAdd() {
    if(this.props.params.username) {
      $.ajax({
        url: '/api/addFood',
        dataType: 'json',
        type: 'POST',
        data: {nutrients:this.state.recipe.nutrition.nutrients,
               date:moment().format('M/DD/YYYY'),
               username:this.props.params.username,
               title:this.state.recipe.title
             },
        cache:false,
        success: function(data) {
          const path = `/user/${this.props.params.username}`
          browserHistory.push(path)  
        }.bind(this),
        error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
      })
    }
  },

  handleBack() {
    const path = this.props.params.username == null ? '/view-meal' : '/view-meal/' + this.props.params.username
    browserHistory.push(path) 
  },

  getInitialState() {
  	// return {food:null}
    const nutrient_names = ["Carbohydrates","Protein","Fat", "Saturated Fat", "Sugar","Iron", "Fiber", "Sodium","Calcium","Vitamin A", "Vitamin C"]
    return ({nutrient_names:nutrient_names,nutrients:[],ingredients:[]})

  },

  componentDidMount() {
    this.loadDetailFromServer()
  },

  render() {

    var cal = $.grep(this.state.nutrients, function(e){return e.title == "Calories"})
    console.log(cal)
    var ingredients_rows = this.state.ingredients.map((ingredient, i)=> {
        return (<tr key={i}>
                  <td>{ingredient.name}</td>
                  <td>{ingredient.amount + ' ' + ingredient.unit}</td>
                </tr>
               )    
    })

    var nutrients_row = this.state.nutrient_names.map((nutrient_name, i)=> {
      var match = $.grep(this.state.nutrients, function(e){return e.title == nutrient_name})
      if (match.length != 0) {
        return (<NutrientRow nutrient={match[0]} key={i} />)    
      } else {
        return (<NutrientRow nutrient={{name:nutrient_name}} key={i} />)
      }
    })
    

    const gridInstance = (
      <Grid>
        <Row className="detail-page">
          <Col xs={4} md={4}>
            <div className="detail-pic"><Image href={this.state.website} src={this.state.img}/></div>
            <div className="detail-pic-name">{this.state.name}</div>
            {this.props.params.username == null ? null : <Button id="detail-pic-button" bsSize="large" onClick={this.handleAdd} >Add Food</Button>}
          </Col>
          <Col xs={8} md={8}>
            <div className="detail-name">{this.state.name}</div>
            <Row className="detail-row">
              <Col xs={2} md={2}><div className="detail-label">Recipe</div></Col>
              <Col xs={1} md={1}></Col>
              <Col xs={7}><div className="detail-text" id="brand-name" ><a href={this.state.sourceUrl} target="_blank">original website</a></div></Col>
            </Row>
            <Row className="detail-row">
              <Col xs={2} md={2}><div className="detail-label">Tags</div></Col>
              <Col xs={1} md={1}></Col>
              <Col xs={7}><div className="detail-text detail-tags">{this.state.tags == null ? null : this.state.tags.join(', ')}</div></Col>
            </Row>
            <Row className="detail-row">
              <Col xs={2} md={2}><div className="detail-label">Calories</div></Col>
              <Col xs={1} md={1}></Col>
              <Col xs={7}><div className="detail-text" id="brand-name" >{cal.length == 0 ? null : cal[0].amount + ' ' + cal[0].unit}</div></Col>
            </Row>

            <Row className="detail-tables">
              <Col xs={5} md={5}>
                <Table striped bordered hover> 
                 <thead>
                  <tr><th>Ingredients</th><th>Quantity</th></tr>
                 </thead>
                 <tbody>
                  {ingredients_rows}
                 </tbody>
                </Table>
              </Col>
              <Col xs={6} md={6}>
                <Row>
                  <Table striped bordered hover> 
                   <thead>
                    <tr><th>Nutrient</th><th>Unit</th></tr>
                   </thead>
                   <tbody>
                    {nutrients_row}
                   </tbody>
                  </Table>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={5} md={5}></Col>
              <Col xs={3} md={3}>
                <Button className="detail-button" bsSize="large" id="detail-back" onClick={this.handleBack} >Back</Button>
              </Col>
              <Col xs={3} md={3}>
                {this.props.params.username == null ? null : <Button className="detail-button" bsSize="large" onClick={this.handleAdd} >Add Food</Button>}
              </Col>
            </Row>
          </Col>
        </Row>
      </Grid>
    )

    return gridInstance
  }
})