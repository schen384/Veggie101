import React from 'react'
import {Link, browserHistory} from 'react-router'
import Meal from './Meal'
import {Grid,Row,Col, Input, Button} from 'react-bootstrap'

export default React.createClass({

  handleSearch(event) {
    event.preventDefault()
    const query = event.target.elements[0].value 
    const url = '/api/search/' + query
    $.ajax({
      url: url,
      cache:false,
      dataType:'JSON',
      success: function(data) {
        if(data.status == 200) {
          this.setState({meals:data.results})
        } else {
          this.setState({meals:[]})
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
      }.bind(this)
    })
  },

  loadMealsFromServer() {
    $.ajax({
      url: '/api/meals',
      dataType:'json',
      cache:false,
      success: function(data) {
        console.log(data);
        // this.setState({meals:data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    })
  },

  getInitialState() {
    var diet_types = ["Dairy+Egg","Dairy + No Egg","No Dairy + Egg","Pescetarian","Vegan"]
    var meal_time = ["Breakfast","Lunch","Dinner","Snack"]
    return {
            meals:[],
            types:diet_types,
            times:meal_time
          }
  },

  componentDidMount() {
    this.loadMealsFromServer()
  },

  render() {

    var rows = this.state.meals.map((item, i) => {
      return (<Meal item={item} key={i} />)
    })

    var types = this.state.types.map((type, i) => {
      return (<Input type="checkbox" className="type-box" label={type} key={i}/>)
    })

    var meal_time = this.state.times.map((time, i) => {
      return (<Input type="checkbox" className="type-box" label={time} key={i}/>)
    })

    const gridInstance = (
      <Grid>
        <Row className="view-meal-page">
          <Col xs={4} md={4}>
            <div className="filter">
              <div className="filter-title">Filter</div>
              <div className="filter-type"> Type </div> 
              {types}
              <div className="filter-type"> Meal </div> 
              {meal_time}
            </div>
          </Col>
          <Col xs={4} md={8}>
            <div className="meals"> 
              <form onSubmit={this.handleSearch}>
                <Input type="text" className="search-input" placeholder="Have a food name in mind?"/>
                <Button type="submit" className="search-btn">Search</Button>
              </form>
              {rows} 
            </div>
          </Col>
        </Row>
      </Grid>
    )

    return gridInstance
    // return (<div className="view-meal">
    		 
    //   		    <div className="col-left">
  	 //    		     <div className="filter-title">Filter</div>
  	 //    		  </div>
  	 //    		  <div className="col-right">
  	 //           {rows}    			
  	 //    		  </div>
    		 
    // 	      </div>
    // )
  }
})