import React from 'react'
import {Button, Input, Grid, Col, Row} from 'react-bootstrap'
import {Link, browserHistory} from 'react-router'

export default React.createClass({
  handleClick(event) {
    event.preventDefault()
    const profile = {
      gender:event.target.elements[0].value,
      age:event.target.elements[1].value,
      ft:event.target.elements[2].value,
      inch:event.target.elements[3].value,
      weight:event.target.elements[4].value,
      diet_type:event.target.elements[5].value,
    }
    

    $.ajax({
      url: '/user/profile',
      type:'POST',
      data:{"profile":profile,"username":this.props.params.username},
      cache:false,
      dataType:'JSON',
      success: function(data) {
          console.log(data)
          const path = `/user/${this.props.params.username}`
          browserHistory.push(path)  
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
      }.bind(this)
    })
  },

  getUserInformation() {
    const user = this.props.params.username
    const url = '/api/profile/' + user
    $.ajax({
      url:url,
      cache:false,
      dataType:"JSON",
      success: function(data) {
          $("#gender").val(data.profile.gender);
          $("#exercise").val(data.profile.exercise_level);
          this.setState({profile:data.profile})
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
      }.bind(this)
    })
  },

  getInitialState() {
    return {profile:{}}
  },

  componentDidMount() {
    this.getUserInformation()
  },

  render() {
    return (<div className="profile">
            <div className="title profile-title">Profile</div>
            <Grid>
            <form onSubmit={this.handleClick}>
              <Row>
                <Col xs={5} md={5}>
                  <div className='label-text profile-text'>Gender</div>
                </Col>
                <Col xs={6} md={6}>
                  <Input type="select" className="veggie-input profile-input" id="gender" name="gender" placeholder="select">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Input>
                </Col>
              </Row>
              <Row>
                <Col xs={5} md={5}>
                  <div className='label-text profile-text' >Age</div>
                </Col>
                <Col xs={2} md={2}>
                  <Input type="text" className="veggie-input profile-input" value={this.state.profile.age}/>
                </Col>
              </Row>
              <Row>
                <Col xs={5} md={5}>
                  <div className='label-text profile-text'>Height</div>
                </Col>
                <Col xs={6} md={6}>
                  <Col xs={3} md={3}>
                    <Input type="text" className="veggie-input profile-input prefix height-input" value={this.state.profile.ft}/>
                  </Col>
                  <Col xs={1} md={1}>
                    <p className="suffix">ft</p>
                  </Col>
                  <Col xs={3} md={3}>
                    <Input type="text" className="veggie-input profile-input prefix height-input" value={this.state.profile.inch}/>
                  </Col>
                  <Col xs={1} md={1}>
                    <p className="suffix">inch</p>
                  </Col>
                </Col>
              </Row>
              <Row>
                <Col xs={5} md={5}>
                  <div className='label-text profile-text'>Weight</div>
                </Col>
                <Col xs={6} md={6}>
                  <Col xs={4} md={4}>
                    <Input type="text" className="veggie-input profile-input prefix height-input"  value={this.state.profile.weight}/>
                  </Col>
                  <Col xs={1} md={1}>
                    <p className="suffix">lb</p>
                  </Col>
                </Col>
              </Row>
              <Row className="exl">
                <Col xs={5} md={5}>
                  <div className='label-text profile-text'>Diet Type</div>
                </Col>
                <Col xs={6} md={6}>
                  <Input type="select" className="veggie-input profile-input" name="diet_type" id="diet_type" placeholder="select">
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="ovo vegetarian">ovo Vegetarian</option>
                    <option value="lacto vegetarian">lacto vegetarian</option>
                    <option value="pescetarian">pescetarian</option>
                  </Input>
                </Col>
              </Row>
              <Row>
                <Col xs={6} md={6}>
                </Col>
                <Col xs={3} md={3}>
                  <Button className="login-btn profile-btn" type='submit' bsSize="large" >Go</Button>
                </Col>
                <Col xs={2} md={2}>
                </Col>
              </Row>



              
            </form>
            </Grid>
            </div>
    )
  }
})