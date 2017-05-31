import Styles from 'styles/main.scss';
import React from 'react';
import { Link } from 'react-router';
import { Flex, WhiteSpace, WingBlank } from 'antd-mobile';
import { connect } from 'react-redux';

class AppComponent extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {
  }

  _handleClick() {
    this.context.router.push({
      pathname: 'login',
    });
  }
  // <div className={Styles.index}>
  //     载入中
  // </div>
  render() {
    return (
      <WingBlank>
        <Flex direction="column">
          <Flex.Item>
           请使用手机模拟模式打开
            </Flex.Item>
          <WhiteSpace />
          <Flex.Item>
            React + Redux + Saga template
            </Flex.Item>
        </Flex>
      </WingBlank>
    );
  }
}

export default connect((store) => { return { user: store.user }; })(AppComponent);
