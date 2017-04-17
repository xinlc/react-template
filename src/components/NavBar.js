import React, { Component } from 'react';
import { NavBar } from 'antd-mobile';
import Browser from 'common/browser';

/**
 * NavBar
 * 微信中打开不显示
 * @class CommonNavBar
 * @extends {Component}
 */
class CommonNavBar extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  // TODO: 判断如果是微信中打开，不显示导航，动态修改 html title

  render() {
    if (Browser.isWeChat) {
      document.querySelector('title').innerText = this.props.children;
      return null;
    }

    return (
      <NavBar
        className="navBar"
        leftContent="返回"
        mode="dark"
        onLeftClick={() => this.context.router.goBack()}
        {...this.props}
      >
        { this.props.children }
      </NavBar>
    );
  }
}

export default CommonNavBar;
