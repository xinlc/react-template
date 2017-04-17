import Styles from 'styles/main.scss';
import React from 'react';
import { Link } from 'react-router';
import { Button } from 'antd-mobile';
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
      <div className={Styles.index}>
        <Button onClick={() => this._handleClick()} size="small" inline type="primary">戳我</Button>
        <Link to="shop">点击link</Link>
      </div>
    );
  }
}

export default connect((store) => { return { user: store.user }; })(AppComponent);
