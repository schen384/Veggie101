import React from 'react'
import {Link, browserHistory} from 'react-router'
import {Grid,Row,Col, Input, Button, Image, Table} from 'react-bootstrap'
import NutrientRow from './NutrientRow'
import { BarStackTooltip } from 'react-d3-tooltip'
import DatePicker from 'react-datepicker'
import moment from 'moment'
// var DatePicker = require('react-datepicker');

// require('css!react-datepicker/dist/react-datepicker.css');

//for dev purpose
// import food_today from 'json!./../food_today_test.json'
// import nutrients_intake from 'json!./../nutrients_intake.json'
// import data from 'dsv!./test.csv'

export default React.createClass({

  loadDetailFromServer() {
    var date = new Date()
    date = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear()
  	const detail_url = '/api/profile/'+this.props.params.username
    $.ajax({
      url: detail_url,
      dataType:'json',
      cache:false,
      success: function(data) {
        var match = $.grep(data.history, function(e){return e.date == date})
        if (match.length != 0) {
          var today_history = match[0]
          this.setState({
            date_selected:moment(),
            history: data.history,
            date:date,
            food_today:today_history.food,
            chartSeries:today_history.food,
            nutrients_intake: today_history.nutrients_intake,
            target_nutrients: data.profile.target_nutrients
          });
        } else {
          this.setState({date_selected:moment(),history:data.history,date:date,target_nutrients: data.profile.target_nutrients})
        }
        
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    })
  },

  handleChange(new_date) {
    const changed_date = moment(new_date).format('M/DD/YYYY')
    var match = $.grep(this.state.history, function(e){return e.date == changed_date})
    if (match.length != 0) {
      var today_history = match[0]
      this.setState({
        date_selected:new_date,
        date:changed_date,
        food_today:today_history.food,
        chartSeries:today_history.food,
        nutrients_intake: today_history.nutrients_intake
      });
    } else {
      this.setState({
        date_selected: new_date,
        date:changed_date,
        food_today:[],
        chartSeries:[],
        nutrients_intake:[]
      });
    }
  },

  handleView() {
    const path = `/view-meal/${this.props.params.username}`
    browserHistory.push(path)  
  },

  getInitialState() {
    const bar_placeholder = [{"name":"Calories"},{"name":"Fat"},{"name":"Protein"},{"name":"Carbs"},{"name":"Sugar"}, {"name":"Sodium"},{"name":"Calcium"}, {"name":"Fiber"},{"name": "Vitamin C"}]
    const nutrient_names = [{"name":"Calories"},{"name":"Fat"},{"name":"Protein"},{"name":"Carbohydrates"},{"name":"Sugar"}, {"name":"Sodium"},{"name":"Calcium"}, {"name":"Fiber"},{"name": "Vitamin C"}]
    return ({nutrient_names:nutrient_names,bar_placeholder:bar_placeholder,target_nutrients:[],food_today:[],chartSeries:[],nutrients_intake:[],date:moment()})
  },

  componentDidMount() {
    this.loadDetailFromServer()
  },

  render() {
    const width = 750,height = 550,
          margins = {top: 0, right: 10, bottom: 25, left: 10},
          title = "Nutrient Percentage",
          chartSeries = this.state.chartSeries,
          x = function(d) {
            return d.name
          },
          xScale = 'ordinal',
          yScale = 'fixed',
          yRange = [0,2],
          yTickFormat = d3.format(".0%")



    const tab_title = this.state.date + ": Meal and Snacks"

    console.log(this.state.target_nutrients)
    const nutrient_row = this.state.nutrient_names.map((nutrient_name, i)=> {
      var match = $.grep(this.state.target_nutrients, function(e){return e.name == nutrient_name.name})
      if (match.length != 0) {
        return (<tr>
                  <td>{match[0].name}</td>
                  <td>{match[0].target_value == null ? "-" : match[0].target_value + ' ' + match[0].unit}</td>
                </tr>)
        return (<NutrientRow nutrient={match[0]} key={i} />)    
      } else {
        return (<NutrientRow nutrient={{title:nutrient_name.name}} key={i} />)
      }
    })
    
    const food_row = this.state.food_today.map((food, i)=> {
      return (<tr key={i}>
                <td>{food.name}</td>
              </tr>
            )
    })

    const barstack = this.state.nutrients_intake.length == 0 ? (
        <BarStackTooltip title={title} data={this.state.bar_placeholder} width={width} height={height}
                               chartSeries={chartSeries} x={x} yDomain={yRange} xScale={xScale} yTickFormat={yTickFormat}/>
    ) : (
        <BarStackTooltip title={title} data={this.state.nutrients_intake} width={width} height={height}
                               chartSeries={chartSeries} x={x} yDomain={yRange} xScale={xScale} yTickFormat={yTickFormat}/>
    )

    const gridInstance = (
      <Grid>
        <Row className="user-page">
          <Col xs={3} md={3} className="user-col">
            <Table striped bordered hover> 
               <thead>
                <tr><th>Nutrient</th><th>Target Values</th></tr>
               </thead>
               <tbody>
                {nutrient_row}
               </tbody>
            </Table>
          </Col>
          <Col xs={6} md={6} className="user-col">
            <Row>
              <div className="user-name">Hi,{this.props.params.username}!</div>
              <DatePicker className="user-datepicker" dateFormat="M/DD/YYYY" selected={this.state.date_selected || this.state.date} onChange={this.handleChange} />  
            </Row>
            <Row>
                {barstack}
            </Row>

          </Col>
          <Col xs={3} md={3} className="user-col">
            <Button className="user-right-btn" bsSize="large" onClick={this.handleView} >View Recipes</Button>
          
            <Table striped bordered hover> 
               <thead>
                <tr><th>{tab_title}</th></tr>
               </thead>
               <tbody>
                {food_row}
               </tbody>
            </Table>
          </Col>
        </Row>
      </Grid>
    )

    return gridInstance
  }
})