import React from 'react';
import Styles from 'styles/login.scss';
import { connect } from 'react-redux';
import { Modal, Flex, Button, InputItem } from 'antd-mobile';
import NavBar from 'components/NavBar';
import Utils from 'common/utils';
import { loginSMS, getCaptcha, sendSMS } from 'actions/auth';
import { updateUserSaga } from 'actions/user';

const Alert = Modal.alert;
const loginLogo = require('images/login-logo.png');

const FREEZETIME = 60;

class SMSLogin extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this._disableCaptcha = false;
    this._disableSMS = false;
    this._countDownID = null;
    this.state = {
      phone: '',
      captcha: '',
      captchaImg: '',
      captchaImgId: '',
      smsCode: '',
      smsExtra: '发送验证码',
      freezetime: FREEZETIME,
    };
  }

  componentDidMount() {
    this._refreshCaptcha();
  }

  componentWillUnmount() {
    clearTimeout(this._countDownID);
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

  _sendSMS() {
    if (this._disableSMS) return false;

    if (!Utils.validator.isMobileNumber(this.state.phone.replace(/\s+/g, ''))) {
      Alert('请输入有效手机号');
      return false;
    } else if (Utils.validator.isEmpty(this.state.captcha)) {
      Alert('请输入图形验证码');
      return false;
    }
    this._disableSMS = true;
    this.props.dispatch(sendSMS(
      this.state.phone.replace(/\s+/g, ''),
      this.state.captcha,
      this.state.captchaImgId,
      'loginbysms',
      (result) => {
        if (result == 'ok') {
          this._countDown();
        } else {  // fail 发送失败
          this._disableSMS = false;
          this._refreshCaptcha();
        }
      }
    ));
    return true;
  }

  _countDown() {
    this._countDownID = setTimeout(() => {
      const time = this.state.freezetime - 1;
      if (time > 0) {
        this.setState({
          freezetime: time,
          smsExtra: `发送验证码(${time})`
        });
        this._countDown();
      } else {
        this.setState({
          freezetime: FREEZETIME,
          smsExtra: '发送验证码'
        });
        this._disableSMS = false;
      }
    }, 1000);
  }

  _verifyInput() {
    if (!Utils.validator.isMobileNumber(this.state.phone.replace(/\s+/g, ''))) {
      Alert('请输入有效手机号');
      return false;
    } else if (Utils.validator.isEmpty(this.state.captcha)) {
      Alert('请输入图形验证码');
      return false;
    } else if (Utils.validator.isEmpty(this.state.smsCode)) {
      Alert('请输入短信验证码');
      return false;
    }
    return true;
  }

  _login() {
    if (this._verifyInput()) {
      this.props.dispatch(loginSMS(
        this.state.phone.replace(/\s+/g, ''),
        this.state.smsCode,
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
          // this.context.router.goBack();
        }
      ));
    }
  }

  render() {
    return (
      <section className={Styles.wrapper}>
        <NavBar>
          短信登陆
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
                className={`${Styles.inputItem} ${Styles.sms}`}
                clear
                placeholder="请输入验证码"
                value={this.state.smsCode}
                extra={(<div style={this.state.freezetime != FREEZETIME ? { color: '#aeaeae' } : null}>{this.state.smsExtra}</div>)}
                onExtraClick={() => {
                  this._sendSMS();
                }}
                onChange={(v) => {
                  this.setState({
                    smsCode: v
                  });
                }}
              >
                短信验证码
              </InputItem>
              <Button className={Styles.btn} type="primary" onClick={() => this._login()}>登陆</Button>
            </Flex>
          </div>
        </div>
      </section>
    );
  }
}

export default connect()(SMSLogin);
