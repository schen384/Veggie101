import React from 'react'
import {Link, browserHistory} from 'react-router'
import {Grid,Row,Col, Input, Button, Image, Table} from 'react-bootstrap'
import NutrientRow from './NutrientRow'

export default React.createClass({

  loadDetailFromServer() {
  	const detail_url = '/api/meal/'+this.props.params.resource_id
    $.ajax({
      url: detail_url,
      dataType:'json',
      cache:false,
      success: function(data) {
        if(data.brand.website) $('#brand-name').wrap("<a href='"+data.brand.website+"'></a>")
        this.setState({nutrients:data.label.nutrients,
                      img:data.images.front.full,
                      name:data.name,
                      brand_name:data.brand.name,
                      qty:data.label.serving.qty,
                      uom:data.label.serving.uom,
                      website:data.brand.website});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    })





  },

  getInitialState() {
  	// return {food:null}
    const tab_1 = ["Total Carbohydrate","Protein","Sugars","Calcium %", "Iron %", "Dietary Fiber", "Sodium"]
    const tab_2 = ["Total Fat", "Saturated Fat", "Monounsaturated Fat","Polyunsaturated Fat"]
    const tab_3 = ["Vitamin A %", "Vitamin C %"]
    return ({tab_1:tab_1,tab_2:tab_2,tab_3:tab_3,nutrients:[],img:null,qty:null,uom:null,name:null,brand_name:null,website:null})

  },

  componentDidMount() {
    this.loadDetailFromServer()
  },

  render() {

    var cal = $.grep(this.state.nutrients, function(e){return e.name == "Calories"})

    var nutrient_1 = this.state.tab_1.map((nutrient_name, i)=> {
      var match = $.grep(this.state.nutrients, function(e){return e.name == nutrient_name})
      console.log(match)
      if (match.length != 0) {
        return (<NutrientRow nutrient={match[0]} key={i} />)    
      } else {
        return (<NutrientRow nutrient={{name:nutrient_name}} key={i} />)
      }
    })

    var nutrient_2 = this.state.tab_2.map((nutrient_name, i)=> {
      var match = $.grep(this.state.nutrients, function(e){return e.name == nutrient_name})
      if (match.length != 0) {
        return (<NutrientRow nutrient={match[0]} key={i} />)    
      } else {
        return (<NutrientRow nutrient={{name:nutrient_name}} key={i} />)
      }
    })

    var nutrient_3 = this.state.tab_3.map((nutrient_name, i)=> {
      var match = $.grep(this.state.nutrients, function(e){return e.name == nutrient_name})
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
            <Button id="detail-pic-button" bsSize="large" onClick={this.handleClick} >Add Food</Button>
          </Col>
          <Col xs={8} md={8}>
            <div className="detail-name">{this.state.name}</div>
            <Row className="detail-row">
              <Col xs={1} md={1}></Col>
              <Col xs={2} md={2}><div className="detail-label">Brand</div></Col>
              <Col xs={1} md={1}></Col>
              <Col xs={8}><div className="detail-text" id="brand-name">{this.state.brand_name}</div></Col>
            </Row>
            <Row className="detail-row">
              <Col xs={1} md={1}></Col>
              <Col xs={2} md={2}><div className="detail-label">Serving</div></Col>
              <Col xs={1} md={1}></Col>
              <Col xs={8}><div className="detail-text">{this.state.qty} {this.state.uom}</div></Col>
            </Row>
            <Row className="detail-row">
              <Col xs={1} md={1}></Col>
              <Col xs={2} md={2}><div className="detail-label">Cal/serving</div></Col>
              <Col xs={1} md={1}></Col>
              <Col xs={8}><div className="detail-text">{cal[0] != null ? cal[0].value + ' ' + cal[0].unit : ''}</div></Col>
            </Row>
            <Row className="detail-tables">
              <Col xs={1} md={1}></Col>
              <Col xs={5} md={5}>
                <Table striped bordered hover> 
                 <thead>
                  <tr><th>Nutrient</th><th>Unit</th></tr>
                 </thead>
                 <tbody>
                  {nutrient_1}
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
                    {nutrient_2}
                   </tbody>
                  </Table>
                </Row>
                <Row>
                  <Table striped bordered hover> 
                   <thead>
                    <tr><th>Nutrient</th><th>Unit</th></tr>
                   </thead>
                   <tbody>
                    {nutrient_3}
                   </tbody>
                  </Table>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={6} md={6}></Col>
              <Col xs={3} md={3}>
                <Button className="detail-button" bsSize="large" id="detail-back" onClick={this.handleClick} >Back</Button>
              </Col>
              <Col xs={3} md={3}>
                <Button className="detail-button" bsSize="large" onClick={this.handleClick} >Add Food</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Grid>
    )

    return gridInstance
  }
})