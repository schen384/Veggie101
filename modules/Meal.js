import React from 'react'
import { Image, Row, Col, Button } from 'react-bootstrap'
import {Link, browserHistory} from 'react-router'


export default React.createClass({

	loadRecipeFromServer() {
		$.ajax({
	      url: '/api/recipe/'+this.props.item.id,
	      dataType:'json',
	      cache:false,
	      success: function(data) {
	        var tags = ["vegetarian","vegan","glutenFree","dairyFree","sustainable","veryHealthy"];
	        var true_tags = [];
	        for(var ind = 0;ind < tags.length;ind++) {
	        	if(data[tags[ind]] == true) true_tags.push(tags[ind])
	        }
	        this.setState({recipe:data,tags:true_tags});
	      }.bind(this),
	      error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    })
	},

	componentDidMount() {
	    this.loadRecipeFromServer()
	},

	getInitialState() {
		return ({recipe:{},tags:[],user:this.props.user})
	},

	render() {
		console.log(this.props.item.username)
		const link = this.props.item.username == null ? '/recipe/'+this.props.item.id : '/recipe/'+this.props.item.id + '/' + this.props.item.username

		const tag_rows = this.state.tags.map((tag,i)=> {
			return (<Row className="meal-tags" key={i}>{tag}</Row>)
		})

		return (
			  <div className="meal">
			  	<Row>
			  		<Col xs={2} md={2}>
				  		<div className="meal-pic"><Image src={this.state.recipe.image} rounded /></div>
				  	</Col>
				  	<Col xs={4} md={4}>
				  		<Row>
				  			<div className="meal-name">{this.state.recipe.title}</div>
				  			<div className="meal-ready">ready in {this.state.recipe.readyInMinutes} min</div>
					  	</Row>
				  	</Col>
				  	<Col xs={4} md={4} className="meal-tag-col">
				  		{tag_rows}
				  	</Col>
				  	<Col xs={2} md={2}>
				  		<Link to={link}>
				  			<Button type="submit" className="detail-btn" >View Detail</Button>
				  		</Link>
				  	</Col>
				</Row>
			  </div>
			)
	}

})
