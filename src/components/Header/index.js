import React, { Component } from 'react';
import { Row, Col } from 'antd';

import logo from './images/logo.jpg';

import './index.less';

export class Header extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
  };

  static defaultProps = {
    prefixCls: 'header-bar',
  };

  loginClick = (e) => {
    window.location.replace('/admin/login/?next=/#/');
  }

  render() {
    const { prefixCls } = this.props;
    return (
      <header className={`${prefixCls}`}>
        <Row type="flex">
          <Col span="3">
            <div className={`${prefixCls}-logo`}><img src={logo} alt="你的铺子" /></div>
          </Col>
          <Col span="9">
            <div className={`${prefixCls}-logo`}><button onClick={this.loginClick}>登录</button></div>
          </Col>
        </Row>
      </header>
    );
  }
}
