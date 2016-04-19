import React from 'react'
import { Image, Row, Col, Button } from 'react-bootstrap'


export default React.createClass({

	render() {
		// console.log(this.props.nutrient)
		const row = (
				<tr>
			  	<td>{this.props.nutrient.title}</td>
			  	<td>{this.props.nutrient.amount == null ? "-" : this.props.nutrient.amount + ' ' + this.props.nutrient.unit}</td>
			  </tr>
			)


		return row
	}

})
