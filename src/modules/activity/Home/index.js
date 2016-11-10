import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Icon, Select, Menu, Button, DatePicker, Table, Popover, Form, message } from 'antd';
import * as constants from 'constants';
import { fetchActivities } from 'redux/modules/activity/activities';
import { fetchFilters } from 'redux/modules/activity/activityFilters';
import { assign, isEmpty, map } from 'lodash';
import moment from 'moment';
import stringcase from 'stringcase';


const actionCreators = {
  fetchActivities,
  fetchFilters,
};

@connect(
  state => ({
    activities: state.activities,
    filters: state.fetchFilters,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

class List extends Component {
  static propTypes = {
    location: React.PropTypes.any,
    prefixCls: React.PropTypes.object,
    form: React.PropTypes.object,
    fetchActivities: React.PropTypes.func,
    fetchFilters: React.PropTypes.func,
    activities: React.PropTypes.object,
    filters: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'activities-home',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    filters: {
      pageSize: 10,
      page: 1,
      ordering: '-start_time',
    },
  }

  componentWillMount() {
    this.props.fetchActivities();
    this.props.fetchFilters();
  }

  componentWillReceiveProps(nextProps) {
    const { activities } = nextProps;
    if (activities.failure) {
      message.error(`请求错误: ${activities.error.detail || ''}`);
    }
  }

  onCreateActivityClick = (e) => {
    this.context.router.push('activity/edit');
  }

  onTableChange = (pagination, filters, sorter) => {
    let ordering = this.state.filters.ordering;
    switch (sorter.order) {
      case 'ascend':
        ordering = `${sorter.column.dataIndex}__${stringcase.snakecase(sorter.column.key)}`;
        break;
      case 'descend':
        ordering = `-${sorter.column.dataIndex}__${stringcase.snakecase(sorter.column.key)}`;
        break;
      default:
        ordering = undefined;
        break;
    }
    this.setFilters({ ordering: ordering });
    this.props.fetchActivities(this.getFilters());
  }

  getFilters = () => (this.state.filters)

  setFilters = function(filters) {
    return this.setState(assign(this.state.filters, filters));
  }

  columns = () => {
    const self = this;
    return [{
      title: '活动ID',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    }, {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTIime',
    }, {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
    }, {
      title: '排序值',
      dataIndex: 'orderVal',
      key: 'orderVal',
    }, {
      title: '上线',
      dataIndex: 'isActiveDisplay',
      key: 'isActiveDisplay',
    }, {
      title: '操作',
      dataIndex: 'id',
      key: 'operation',
      render: (id) => (
        <span>
          <Link to={`activity/edit?id=${id}`}>编辑</Link>
          <span className="ant-divider"></span>
          <Link to={`activity/products?id=${id}`}>活动商品</Link>
        </span>
      ),
    }];
  }

  tableProps = () => {
    const self = this;
    const { activities } = this.props;

    return {
      className: 'margin-top-sm',
      rowKey: (record) => (record.id),
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          const selected = map(selectedRows, (row) => ({ id: row.id, name: row.title }));
          self.setSelected(selected);
        },
      },
      pagination: {
        total: activities.items.count || 0,
        showTotal: total => `共 ${total} 条`,
        showSizeChanger: true,
        onShowSizeChange(current, pageSize) {
          self.setFilters({ pageSize: pageSize, page: current });
          self.props.fetchActivities(self.getFilters());
        },
        onChange(current) {
          self.setFilters({ page: current });
        },
      },
      loading: activities.isLoading,
      dataSource: activities.items.results,
      onChange: this.onTableChange,
    };
  }

  formItemLayout = () => ({
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  })

  render() {
    const { prefixCls, activities } = this.props;
    const { getFieldProps } = this.props.form;
    return (
      <div className={`${prefixCls}`} >
        <Form horizontal className="ant-advanced-search-form">
          <Row type="flex" justify="start" align="middle">
            <Col span={2}>
              <Button type="primary" onClick={this.onCreateActivityClick}>新建活动</Button>
            </Col>
          </Row>
        </Form>
        <Table className="margin-top-sm" columns={this.columns()} loading={activities.isLoading} {...this.tableProps()} dataSource={activities.items.results} />
      </div>
    );
  }
}

export const Home = Form.create()(List);
