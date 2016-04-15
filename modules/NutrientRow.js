import React from 'react'
import { Image, Row, Col, Button } from 'react-bootstrap'


export default React.createClass({

	render() {
		// console.log(this.props.nutrient)
		const row = (
				<tr>
			  	<td>{this.props.nutrient.name}</td>
			  	<td>{this.props.nutrient.value == null ? "-" : this.props.nutrient.value + ' ' + this.props.nutrient.unit}</td>
			  </tr>
			)


		return row
	}

})
