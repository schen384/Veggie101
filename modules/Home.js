import React from 'react'
import {Button, Grid, Row, Col} from 'react-bootstrap'
import {Link, browserHistory} from 'react-router'

export default React.createClass({
  handleClick(event) {
  	if(event.target.name == 'view-meal') {
  		const path = `/view-meal`
  		browserHistory.push(path)
  	} else {
  		const path = `/register`
  		browserHistory.push(path)
  	}
  	console.log(event.target.name)
  },

  render() {
    return (<div className="home">
    		 
    		   <div className="home-top">
	    		   <div className="home-title">We help you find the right food</div>
	    		   <div className="home-options">
	    		   	 <Button name='view-meal' className="home-button"  bsSize="large" onClick={this.handleClick} >View Suggested Meals</Button>
					 <Button className="home-button"  bsSize="large" onClick={this.handleClick} >Register with Email</Button>
	    		   </div>
	    		</div>
	    		<div className="home-bot">
	    			<div className="tutorial">
	    				<div className="tutorial-title">How to use Vegie 101</div>
	    			</div>
	    		</div>
    		 
    	   </div>
    )
  }
})