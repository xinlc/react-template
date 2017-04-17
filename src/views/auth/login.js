import React from 'react';
import Styles from 'styles/login.scss';
import { connect } from 'react-redux';
import { Modal, Flex, Button, InputItem, } from 'antd-mobile';
import NavBar from 'components/NavBar';
import Utils from 'common/utils';
import { loginPwd, getCaptcha } from 'actions/auth';
import { updateUserSaga } from 'actions/user';

const Alert = Modal.alert;
const loginLogo = require('images/login-logo.png');

class Login extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this._disableCaptcha = false;
    this.state = {
      phone: '',
      password: '',
      captcha: '',
      captchaImg: '',
      captchaImgId: '',
    };
  }

  componentDidMount() {
    this._refreshCaptcha();
  }

  componentWillReceiveProps() {
  }

  _refreshCaptcha() {
    if (this._disableCaptcha) {
      Alert('亲，您刷新的太快了哦！');
      return;
    }
    this.props.dispatch(getCaptcha((result) => {
      this.setState({
        captchaImg: `data:image/jpg;base64,${result.img}`,
        captchaImgId: result.imgId,
      });
    }));
    this._disableCaptcha = true;
    setTimeout(() => {
      this._disableCaptcha = false;
    }, 800);
  }

  _verifyInput() {
    if (!Utils.validator.isMobileNumber(this.state.phone.replace(/\s+/g, ''))) {
      Alert('请输入有效手机号');
      return false;
    } else if (Utils.validator.isEmpty(this.state.captcha)) {
      Alert('请输入图形验证码');
      return false;
    } else if (!Utils.validator.isPassword(this.state.password)) {
      Alert('密码为6-20字符，可由字母、数字组成');
      return false;
    }
    return true;
  }

  _login() {
    if (this._verifyInput()) {
      this.props.dispatch(loginPwd(
        this.state.phone.replace(/\s+/g, ''),
        this.state.password,
        this.state.captchaImgId,
        this.state.captcha,
        (result) => { // success callback
          this.props.dispatch(updateUserSaga({
            id: result.uid,
            hasPassword: result.hasPassword,
            phone: result.phone,
            photo: result.photo,
            Token: result.token,
            userName: result.userName
          }));

          // 跳转页面
          let url = '/shop';
          const state = this.context.router.location.state;
          if (state && state.nextPathname) {
            url = state.nextPathname;
          }
          this.context.router.replace({
            pathname: url,
          });
        }
      ));
    }
  }

  _openDynPwdLogin() {
    this.context.router.push({
      pathname: '/login/sms',
    });
  }

  _openForgetPwd() {
    this.context.router.push({
      pathname: '/forgetPassword',
    });
  }

  render() {
    return (
      <section className={Styles.wrapper}>
        <NavBar>
          登陆
        </NavBar>
        <div className={Styles.scrollView}>
          <div className={Styles.content}>
            <Flex className={Styles.header} justify="center">
              <img src={loginLogo} alt="" />
            </Flex>
            <Flex className={Styles.main} direction="column" justify="start" align="center">
              <InputItem
                className={`${Styles.inputItem} ${Styles.inputPhone}`}
                type="phone"
                placeholder="请输入手机号"
                value={this.state.phone}
                clear
                onChange={(v) => {
                  this.setState({
                    phone: v
                  });
                }}
              >
                手机号码
              </InputItem>
              <InputItem
                className={`${Styles.inputItem} ${Styles.captcha}`}
                clear
                placeholder="请输入验证码"
                value={this.state.captcha}
                extra={(<img src={this.state.captchaImg} alt="验证码" />)}
                onExtraClick={() => {
                  this._refreshCaptcha();
                }}
                onChange={(v) => {
                  this.setState({
                    captcha: v
                  });
                }}
              >
                图形验证码
              </InputItem>
              <InputItem
                className={`${Styles.inputItem} ${Styles.inputPwd}`}
                type="password"
                placeholder="输入密码"
                value={this.state.password}
                maxLength={20}
                clear
                onChange={(v) => {
                  this.setState({
                    password: v
                  });
                }}
              >
                密码
              </InputItem>
              <Button className={Styles.btn} type="primary" onClick={() => this._login()}>登陆</Button>
              <Button className={Styles.btn} type="ghost" onClick={() => this._openDynPwdLogin()}>验证码登陆</Button>
            </Flex>
            <Flex className={Styles.footer} justify="center">
              <Button className={Styles.forgetPwd} onClick={() => this._openForgetPwd()}>设置/忘记密码</Button>
            </Flex>
          </div>
        </div>
      </section>
    );
  }
}

export default connect()(Login);
