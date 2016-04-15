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
      exercise_level:event.target.elements[5].value,
    }
    

    $.ajax({
      url: '/user/profile',
      type:'POST',
      data:{"profile":profile,"username":this.props.params.username},
      cache:false,
      dataType:'JSON',
      success: function(data) {
          console.log(data)
          // const path = `/user/${username}`
          // browserHistory.push(path)  
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
                <Col xs={6} md={6}>
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
                <Col xs={6} md={6}>
                  <div className='label-text profile-text' >Age</div>
                </Col>
                <Col xs={2} md={2}>
                  <Input type="text" className="veggie-input profile-input" value={this.state.profile.age}/>
                </Col>
              </Row>
              <Row>
                <Col xs={6} md={6}>
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
                <Col xs={6} md={6}>
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
                <Col xs={6} md={6}>
                  <div className='label-text profile-text'>Exercise Level (optional)</div>
                </Col>
                <Col xs={6} md={6}>
                  <Input type="select" className="veggie-input profile-input" name="exercise_level" id="exercise" placeholder="select">
                    <option value="little">Little to no exercise</option>
                    <option value="light">Light exercise (1-3 days per week)</option>
                    <option value="moderate">Moderate exercise (3-5 days per week)</option>
                    <option value="heavy">Heavy exercise (6-7 days per week)</option>
                    <option value="very-heavy">Very heavy exercise (twice per day, extra heavy workouts)</option>
                  </Input>
                </Col>
              </Row>
              <Row>
                <Col xs={7} md={7}>
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