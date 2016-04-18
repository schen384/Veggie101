import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router'
import {IndexLinkContainer, LinkContainer} from 'react-router-bootstrap'
var Navbar = require("react-bootstrap/lib/Navbar");
var Nav = require("react-bootstrap/lib/Nav");
var NavItem = require("react-bootstrap/lib/NavItem");
var MenuItem = require("react-bootstrap/lib/MenuItem");
var NavDropdown = require("react-bootstrap/lib/NavDropdown");

class Menu extends React.Component {
  render() {

    return (
      <Navbar inverse>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/"><span>Veggie 101</span></Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <LinkContainer to="/register"><NavItem>Register</NavItem></LinkContainer>
            <LinkContainer to="/login"><NavItem>Login</NavItem></LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
  componentDidMount() {
    // Collapse the mobile navbar on click
    const navBar = ReactDOM.findDOMNode(this);
    const collapsibleNav = navBar.querySelector('div.navbar-collapse');
    const btnToggle = navBar.querySelector('button.navbar-toggle');

    navBar.addEventListener('click', (evt) => {
      if (evt.target.tagName !== 'A' || evt.target.classList.contains('dropdown-toggle') || ! collapsibleNav.classList.contains('in')) {
        return;
      }

      btnToggle.click();
    }, false);
  }
}

module.exports = Menu;