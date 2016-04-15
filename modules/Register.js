import React from 'react'
import {Button, Input, Grid, Col, Row} from 'react-bootstrap'
import {Link, browserHistory} from 'react-router'

export default React.createClass({
  handleClick(event) {
    event.preventDefault()
    const username = event.target.elements[0].value
    const password = event.target.elements[1].value
    const email = event.target.elements[2].value
    $.ajax({
      url: '/auth/register',
      type:'POST',
      data:{"username":username,"password":password,"email":email},
      cache:false,
      dataType:'JSON',
      success: function(data) {
          console.log(data)
          const path = `/profile/${username}`
          browserHistory.push(path)  
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
      }.bind(this)
    })
    
  },

  render() {
    return (
        <div className="register">
            <Grid>
              <Row>
                <Col xs={4} md={4}></Col>
                <Col xs={4} md={4}>
                   <div className="title">Register</div>
                   <form onSubmit={this.handleClick}>
                     <div className='username'>
                        <div className='label-text'>Username</div>
                        <Input type="text" className="veggie-input" placeholder=""/>
                     </div>
                     <div className='password'>
                        <div className='label-text'>Password</div>
                        <Input type="password" className="veggie-input" placeholder=""/>
                     </div>
                     <div className='Email'>
                        <div className='label-text'>Email</div>
                        <Input type="text" className="veggie-input" placeholder=""/>
                     </div>
                     <Button className="login-btn" type='submit' bsSize="large" >Sign Up</Button>
                   </form>
                 </Col>
                 <Col xs={4} md={4}></Col>
              </Row>
            </Grid>
            </div>
    )
  }
})