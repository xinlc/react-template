import React from 'react';
import Styles from 'styles/login.scss';
import { connect } from 'react-redux';
import { Modal, Toast, Flex, Button, InputItem, } from 'antd-mobile';
import NavBar from 'components/NavBar';
import Utils from 'common/utils';
import { resetPassword } from 'actions/auth';

const Alert = Modal.alert;
const loginLogo = require('images/logo.png');

class ResetPassword extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      password: '',
      rePassword: '',
    };
  }

  componentDidMount() {
  }

  _verifyInput() {
    if (!Utils.validator.isPassword(this.state.password)) {
      Alert('密码为6-20字符，可由字母、数字组成');
      return false;
    } else if (this.state.password != this.state.rePassword) {
      Alert('两次密码不一致');
      return false;
    }
    return true;
  }

  _confirm() {
    if (this._verifyInput()) {
      const state = this.context.router.location.state;
      this.props.dispatch(resetPassword(
        state.phone,
        state.smsCode,
        this.state.password,
        () => { // success callback
          Toast.info('新密码设置成功', 1.5);
          this.context.router.push('/login');
        }
      ));
    }
  }

  render() {
    return (
      <section className={Styles.wrapper}>
        <NavBar>
          设置新密码
        </NavBar>
        <div className={Styles.scrollView}>
          <div className={Styles.content}>
            <Flex className={Styles.header} justify="center">
              <img className={Styles.appLogo} src={loginLogo} alt="" />
            </Flex>
            <Flex className={Styles.main} direction="column" justify="start" align="center">
              <InputItem
                className={`${Styles.inputItem} ${Styles.inputPwd}`}
                type="password"
                placeholder="输入新密码"
                value={this.state.password}
                maxLength={20}
                clear
                onChange={(v) => {
                  this.setState({
                    password: v
                  });
                }}
              >
                新密码
              </InputItem>
              <InputItem
                className={`${Styles.inputItem} ${Styles.inputPwd}`}
                type="password"
                placeholder="确认新密码"
                value={this.state.rePassword}
                maxLength={20}
                clear
                onChange={(v) => {
                  this.setState({
                    rePassword: v
                  });
                }}
              >
                确认密码
              </InputItem>
              <Button className={Styles.btn} type="primary" onClick={() => this._confirm()}>确认</Button>
            </Flex>
          </div>
        </div>
      </section>
    );
  }
}

export default connect()(ResetPassword);
