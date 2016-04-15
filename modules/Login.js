import React from 'react'
import {Button, Input, Grid, Col, Row} from 'react-bootstrap'
import {Link, browserHistory} from 'react-router'

export default React.createClass({
  handleClick(event) {
    event.preventDefault()
    const username = event.target.elements[0].value
    const password = event.target.elements[1].value
    $.ajax({
      url: '/auth/login',
      type:'POST',
      data:{"username":username,"password":password},
      cache:false,
      dataType:'JSON',
      success: function(data) {
        if(data.status) {
          const path = `/user/${username}`
          browserHistory.push(path)  
        } else {
          alert("Authentication Failed")
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
      }.bind(this)
    })
    
  },

  render() {
    return (<div className="login">
            <Grid>
              <Row>
                <Col xs={4} md={4}></Col>
                <Col xs={4} md={4}>
                   <div className="title">Login</div>
                   <form onSubmit={this.handleClick}>
                     <div className='username'>
                        <div className='label-text'>Username</div>
                        <Input type="text" className="veggie-input" placeholder=""/>
                     </div>
                     <div className='password'>
                        <div className='label-text'>Password</div>
                        <Input type="password" className="veggie-input" placeholder=""/>
                     </div>
                     <Button className="login-btn" type='submit' bsSize="large" >Go</Button>
                   </form>
                 </Col>
                 <Col xs={4} md={4}></Col>
              </Row>
            </Grid>
            </div>
    )
  }
})