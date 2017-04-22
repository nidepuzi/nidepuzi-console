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

  render() {
    const { prefixCls } = this.props;
    return (
      <header className={`${prefixCls}`}>
        <Row type="flex">
          <Col span="3">
            <div className={`${prefixCls}-logo`}><img src={logo} alt="你的铺子" /></div>
          </Col>
        </Row>
      </header>
    );
  }
}
