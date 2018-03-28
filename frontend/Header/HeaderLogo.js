/* @flow */

import React, { Component } from 'react';
import apolloLogo from '../../static/icon-apollo-white.small.svg';
import apolloSubbrand from '../../static/logo-apollo-white-subbrand-launchpad.svg';

export default class HeaderLogo extends Component {
  render() {
    return (
      <div className="HeaderLogo">
        <a href="https://www.launchpad.graphql.com/new">
          <img className="Logo" src={apolloLogo} alt="Apollo Logo" />
        </a>
        <a href="/new">
          <img
            className="Subbrand"
            src={apolloSubbrand}
            alt="Apollo Launchpad"
          />
        </a>
      </div>
    );
  }
}
