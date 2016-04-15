import React from 'react'
import { Link, IndexLink } from 'react-router'
import NavLink from './NavLink'
import Menu from './Menu'

export default React.createClass({

  render() {
    return (
      <div className={'page-' + (this.props.location.pathname.replace(/^\/+/,'').replace(/\//g,'-') || 'home')}>
        <Menu />
        {this.props.children}
      </div>
    );
  }

})