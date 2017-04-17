import React from 'react';
import Styles from 'styles/login.scss';
import { connect } from 'react-redux';
import { Modal, Toast, Flex, Button, InputItem, Icon } from 'antd-mobile';
import NavBar from 'components/NavBar';
import Utils from 'common/utils';
import { getCaptcha, sendSMS } from 'actions/auth';
import { resetPhone } from 'actions/user';

const Alert = Modal.alert;
const logo = require('images/logo.png');
const loginLogo = require('images/login-logo.png');


const FREEZETIME = 60;

class ChangePhone extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this._disableCaptcha = false;
    this._disableSMS = false;
    this._countDownID = null;
    this.state = {
      step: (this.props.params.state == 'login' ? 2 : 1),
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
      'changephone',
      (result) => {
        if (result == 'ok') {
          this._countDown();
        } else {  // fail 发送失败
          this._disableSMS = false;
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

  _chagePhone() {
    if (this._verifyInput()) {
      this.props.dispatch(resetPhone(
        this.state.phone.replace(/\s+/g, ''),
        this.state.smsCode,
        () => { // success callback
          Toast.info('手机号更新成功', 1.5);
          if (this.context.router.location.state && this.context.router.location.state.nextPathname) {
            this.context.router.replace(this.context.router.location.state.nextPathname);
          } else {
            this.context.router.replace('/shop');
          }
        }
      ));
    }
  }

  _openSetPassword() {
    this.context.router.push({
      pathname: '/forgetPassword',
    });
  }

  _render() {
    return (
      <section className={Styles.cpWrapper}>
        <NavBar>
          餐饮帮
        </NavBar>
        <div className={Styles.scrollView}>
          <div className={`${Styles.content} ${Styles.whiteBG}`}>
            <Flex className={`${Styles.header} ${Styles.whiteBG}`} justify="center">
              <img className={Styles.appLogo} src={logo} alt="" />
            </Flex>
            <Flex className={`${Styles.cpMain}`} direction="column" justify="center" align="center">
              <span className={Styles.cpPhoneLable}>当前登录手机号</span>
              {
                this.props.user.phone ? (
                  <span className={Styles.cpPhone}>
                    <Icon className={Styles.cpPhoneIcon} type={require('fonts/phone.svg')} />
                    {this.props.user.phone}
                  </span>
                ) : (
                  <span className={Styles.cpPhone}>您没有绑定手机号</span>
                )
              }
            </Flex>
            <Flex className={Styles.cpFooterBtns} justify="center" align="center">
              <Button className={Styles.cpBtn} type="ghost" onClick={() => this.setState({ step: 2 })}>更换登录手机号</Button>
            </Flex>
          </div>
        </div>
      </section>
    );
  }

  _renderChangePhoneNumber() {
    return (
      <section className={Styles.wrapper}>
        <NavBar
          onLeftClick={() => {
            this.setState({ step: 1 });
          }}
        >
          {this.props.params.state == 'login' ? '登录' : '更换登录手机号'}
        </NavBar>
        <div className={Styles.scrollView}>
          <div className={Styles.content}>
            <Flex className={Styles.header} justify="center">
              <img className={this.props.params.state == 'login' ? '' : Styles.appLogo} src={this.props.params.state == 'login' ? loginLogo : logo} alt="" />
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
              <Button className={Styles.btn} type="primary" onClick={() => this._chagePhone()}>确定</Button>
            </Flex>
          </div>
        </div>
      </section>
    );
  }

  render() {
    if (this.state.step == 1) {
      return this._render();
    }
    return this._renderChangePhoneNumber();
  }
}

export default connect(store => ({ user: store.user }))(ChangePhone);

