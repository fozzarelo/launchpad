/* @flow */

import React, { Component } from 'react';
import apolloLogo from '../../static/icon-apollo-white.small.svg';
import apolloSubbrand from '../../static/logo-apollo-white-subbrand-launchpad.svg';

export default class HeaderLogo extends Component {
  render() {
    return (
      <a href="/new" className="HeaderLogo">
        <img className="Logo" src={apolloLogo} alt="Apollo Logo" />
        <img className="Subbrand" src={apolloSubbrand} alt="Apollo Launchpad" />
      </a>
    );
  }
}
