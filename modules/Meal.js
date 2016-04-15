import React from 'react'
import { Image, Row, Col, Button } from 'react-bootstrap'
import {Link, browserHistory} from 'react-router'


export default React.createClass({

	render() {
		return (
			  <div className="meal">
			  	<Row>
			  		<Col xs={4} md={2}>
				  		<div className="meal-pic"><Image src={this.props.item.thumbnail} rounded /></div>
				  	</Col>
				  	<Col xs={4} md={5}>
					  	<div className="meal-name">{this.props.item.item_name}</div>
					  	<div className="meal-brand">{this.props.item.brand_name}</div>
				  	</Col>
				  	<Col xs={2} md={3}>

					  	<div className="nutrient-name">{this.props.item.nutrient_name}</div>
					  	<div className="nutrient-value">
					  		{this.props.item.nutrient_value} {this.props.item.nutrient_uom} 
					  	</div>
					  	<div className="nutrient-serving">
					  		{this.props.item.serving_qty} {this.props.item.serving_uom}  
					  	</div>
				  	</Col>
				  	<Col xs={2} md={2}>
				  		<Link to={'/meal/'+this.props.item.resource_id}>
				  			<Button type="submit" className="detail-btn" >View Detail</Button>
				  		</Link>
				  	</Col>
				</Row>
			  </div>
			)
	}

})
