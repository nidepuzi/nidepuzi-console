import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Icon, Dropdown, Menu, Button, DatePicker, Table, Checkbox, Input, Popover, Select } from 'antd';
import { If } from 'jsx-control-statements';
import Modals from 'modules/Modals';
import * as constants from 'constants';
import { fetchSchedule } from 'redux/modules/supplyChain/schedule';
import { fetchProducts, addProduct, updateProduct, updatePosition, updateAssignedWorker, deleteProduct } from 'redux/modules/supplyChain/scheduleProducts';
import { fetchUsers } from 'redux/modules/auth/users';
import { merge, map } from 'lodash';
import stringcase from 'stringcase';

const actionCreators = { fetchSchedule, fetchProducts, addProduct, updateProduct, updatePosition, updateAssignedWorker, deleteProduct, fetchUsers };

@connect(
  state => ({
    scheduleProducts: state.scheduleProducts,
    schedule: state.schedule,
    users: state.users,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export class Products extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    children: React.PropTypes.any,
    location: React.PropTypes.any,
    form: React.PropTypes.object,
    fetchSchedule: React.PropTypes.func,
    fetchProducts: React.PropTypes.func,
    addProduct: React.PropTypes.func,
    updateProduct: React.PropTypes.func,
    updatePosition: React.PropTypes.func,
    updateAssignedWorker: React.PropTypes.func,
    deleteProduct: React.PropTypes.func,
    fetchUsers: React.PropTypes.func,
    schedule: React.PropTypes.object,
    scheduleProducts: React.PropTypes.object,
    users: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'schedule-products',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    filters: {
      pageSize: 10,
      page: 1,
      ordering: 'order_weight',
    },
    selectedRowKeys: [],
    modalVisible: false,
    previewModalVisible: false,
    previewLink: '',
    desingerPopoverVisible: false,
    maintainerPopoverVisible: false,
    desinger: 0,
    maintainer: 0,
    distance: 1,
  }

  componentWillMount() {
    const { id } = this.props.location.query;
    this.props.fetchSchedule(id);
    this.props.fetchProducts(id, this.getFilters());
    this.props.fetchUsers({
      isStaff: 'True',
      page: 1,
      pageSize: 100,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.scheduleProducts.success) {
      this.setState({
        desinger: 0,
        maintainer: 0,
        selectedRowKeys: [],
      });
    }
  }

  onOkClick = (selected) => {
    const { id } = this.props.location.query;
    this.props.addProduct(id, selected);
    this.toggleModalVisible();
  }

  onPromotionChange = (e) => {
    const { id } = this.props.location.query;
    const { checked, productId } = e.target;
    this.props.updateProduct(id, productId, {
      isPromotion: checked,
    }, this.getFilters());
  }

  onUpdatePositionClick = (e) => {
    const { id } = this.props.location.query;
    const { direction, productid } = e.currentTarget.dataset;
    this.setFilters({ ordering: 'order_weight' });
    this.props.updatePosition(id, productid, {
      direction: direction,
      distance: this.state.distance,
    }, this.getFilters());
    this.setState({ distance: 1 });
  }

  onDeleteClick = (e) => {
    const { id } = this.props.location.query;
    const { productid } = e.currentTarget.dataset;
    this.props.deleteProduct(id, productid, this.getFilters());
  }

  onPreviewClick = (e) => {
    const { productid } = e.currentTarget.dataset;
    const { protocol, host } = window.location;
    this.setState({
      previewModalVisible: true,
      previewLink: `${protocol}//${host}/mall/product/details/${productid}?preview=true`,
    });

  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

  onAssignDesingerClick = (e) => {
    const { id } = this.props.location.query;
    this.toggleDesingerPopoverVisble();
    this.props.updateAssignedWorker(id, {
      photoUser: this.state.desinger,
      managerDetailIds: this.state.selectedRowKeys,
    }, this.getFilters());
  }

  onDesingerChange = (userId) => {
    this.setState({ desinger: userId });
  }

  onAssignMaintainerClick = (e) => {
    const { id } = this.props.location.query;
    this.toggleMaintainerPopoverVisible();
    this.props.updateAssignedWorker(id, {
      referenceUser: this.state.maintainer,
      managerDetailIds: this.state.selectedRowKeys,
    }, this.getFilters());
  }

  onMaintainerChange = (userId) => {
    this.setState({ maintainer: userId });
  }

  onTableChange = (pagination, filters, sorter) => {
    const { id } = this.props.location.query;
    let ordering = this.state.filters.ordering;
    switch (sorter.order) {
      case 'ascend':
        ordering = `${stringcase.snakecase(sorter.column.key)}`;
        break;
      case 'descend':
        ordering = `-${stringcase.snakecase(sorter.column.key)}`;
        break;
      default:
        ordering = undefined;
        break;
    }
    this.setFilters({ ordering: ordering });
    this.props.fetchProducts(id, this.getFilters());
  }

  getFilters = () => (this.state.filters)

  setFilters = (filters) => {
    this.setState(merge(this.state.filters, filters));
  }

  setDistance = (e) => {
    this.setState(merge(this.state, { distance: Number(e.target.value) }));
  }

  suppliers = () => {
    const { schedule } = this.props;
    return map(schedule.saleSuppliers, (supplier) => ({ id: supplier.id, name: supplier.supplierName }));
  }

  toggleModalVisible = (e) => {
    this.setState(merge(this.state, { modalVisible: !this.state.modalVisible }));
  }

  toggleDesingerPopoverVisble = () => {
    this.setState({ desingerPopoverVisible: !this.state.desingerPopoverVisible });
  }

  toggleMaintainerPopoverVisible = () => {
    this.setState({ maintainerPopoverVisible: !this.state.maintainerPopoverVisible });
  }

  togglePreviewModalVisible = (e) => {
    this.setState({ previewModalVisible: !this.state.previewModalVisible });
  }

  ajustPositionPopover = (productId, direction) => {
    const { schedule } = this.props;
    const directions = {
      minus: {
        icon: 'arrow-up',
        addonBefore: '向上移动',
      },
      plus: {
        icon: 'arrow-down',
        addonBefore: '向下移动',
      },
    };
    const buttonProps = {
      'data-productid': productId,
      'data-direction': direction,
      className: 'pull-right',
      style: { marginTop: 10 },
      size: 'small',
      type: 'primary',
    };
    const content = (
      <div className="clearfix" style={{ width: 200 }}>
        <Input type="number" addonBefore={directions[direction].addonBefore} addonAfter="个位置" defaultValue={1} onChange={this.setDistance} />
        <Button {...buttonProps} onClick={this.onUpdatePositionClick}>确认</Button>
      </div>
    );

    return (
      <Popover trigger="click" content={content} title="调整位置">
        <Button size="small" type="primary" shape="circle" icon={directions[direction].icon} disabled={schedule.lockStatus} />
      </Popover>
    );
  }

  usersPopover = (params) => {
    const { title, visible, disabled, onClick, onOk, onChange } = params;
    const { users } = this.props;
    const buttonProps = {
      className: 'pull-right',
      style: { marginTop: 10 },
      size: 'small',
      type: 'primary',
    };
    const content = (
      <div className="clearfix" style={{ width: 200 }}>
        <Select showSearch style={{ width: 200 }} placeholder="请选择人员" optionFilterProp="children" notFoundContent="无法找到该员工" onChange={onChange}>
          {users.items.map((user) => (<Select.Option value={user.id}>{`${user.lastName}${user.firstName}`}</Select.Option>))}
        </Select>
        <Button {...buttonProps} onClick={onOk}>确认</Button>
      </div>
    );
    return (
      <Popover trigger="click" visible={visible} content={content} placement="bottom" title={title}>
        <Button type="primary" onClick={onClick} disabled={disabled}>{title}</Button>
      </Popover>
    );
  }

  columns = () => {
    const { scheduleProducts, schedule } = this.props;
    return [{
      title: 'id',
      dataIndex: 'modelId',
      key: 'modelId',
    }, {
      title: '图片',
      dataIndex: 'productPic',
      key: 'productPic',
      render: (productPic, record) => {
        const conetnt = (<img style={{ height: '360px' }} src={productPic} role="presentation" />);
        return (
          <Popover placement="right" content={conetnt} trigger="hover">
            <img style={{ height: '80px' }} src={productPic} role="presentation" />
          </Popover>
        );
      },
    }, {
      title: '名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 260,
      render: (productName, record) => (<a target="_blank" href={record.productLink}>{productName}</a>),
    }, {
      title: '吊牌价',
      dataIndex: 'productOriginPrice',
      key: 'productOriginPrice',
    }, {
      title: '售价',
      dataIndex: 'productSalePrice',
      key: 'productSalePrice',
    }, {
      title: '采购价',
      dataIndex: 'productPurchasePrice',
      key: 'productPurchasePrice',
    }, {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierId',
      render: (supplierName) => (supplierName || '-'),
      sorter: true,
    }, {
      title: '设计',
      dataIndex: 'photoUsername',
      key: 'photoUsername',
      render: (username, record) => (username || '-'),
      sorter: true,
    }, {
      title: '资料录入',
      dataIndex: 'referenceUsername',
      key: 'referenceUsername',
      render: (username, record) => (username || '-'),
      sorter: true,
    }, {
      title: '每日推送商品',
      dataIndex: 'id',
      key: 'id',
      render: (productId, record) => {
        const checkboxProps = {
          checked: record.isPromotion,
          onChange: this.onPromotionChange,
          productId: productId,
          disabled: schedule.lockStatus,
        };
        return (
          <Checkbox {...checkboxProps}>设为推送</Checkbox>
        );
      },
    }, {
      title: '调整位置',
      dataIndex: 'orderWeight',
      key: 'orderWeight',
      render: (orderWeight, record) => (
        <div style={{ width: 60, textAlign: 'center' }}>
          <div className="pull-left">
            {this.ajustPositionPopover(record.id, 'plus')}
          </div>
          <div className="pull-right">
            {this.ajustPositionPopover(record.id, 'minus')}
          </div>
        </div>
      ),
    }, {
      title: '操作',
      dataIndex: 'operating',
      key: 'operating',
      render: (text, record) => (
        <div>
          <a target="_blank" href={`/apis/items/v1/product?supplier_id=${record.supplierId}&saleproduct=${record.saleProductId}`} disabled={schedule.lockStatus}>资料录入</a>
          <span className="ant-divider"></span>
          <a target="_blank" href={`/mm/add_aggregeta/?search_model=${record.modelId}`} disabled={schedule.lockStatus}>上传图片</a>
          <span className="ant-divider"></span>
          <a data-productid={record.id} onClick={this.onDeleteClick} disabled={schedule.lockStatus}>删除商品</a>
          <span className="ant-divider"></span>
          <a data-productid={record.modelId} onClick={this.onPreviewClick}>预览商品</a>
        </div>
      ),
    }];
  }

  tableProps = () => {
    const self = this;
    const { id } = this.props.location.query;
    const { scheduleProducts, schedule } = this.props;
    const { selectedRowKeys } = this.state;
    return {
      pagination: {
        total: scheduleProducts.count || 0,
        showTotal: (total) => (`共 ${total} 条`),
        showSizeChanger: true,
        onShowSizeChange(current, pageSize) {
          self.setFilters({ pageSize: pageSize, page: current });
          self.props.fetchProducts(id, self.getFilters());
        },
        onChange(current) {
          self.setFilters({ page: current });
          self.props.fetchProducts(id, self.getFilters());
        },
      },
      rowSelection: {
        selectedRowKeys,
        onChange: this.onSelectChange,
      },
      rowKey: (record) => (record.id),
      loading: scheduleProducts.isLoading,
      dataSource: scheduleProducts.items,
      className: 'margin-top-sm',
      onChange: this.onTableChange,
    };
  }

  render() {
    const { prefixCls } = this.props;
    const { schedule, scheduleProducts } = this.props;
    const { selectedRowKeys } = this.state;
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div className={`${prefixCls}`} >
        <Row type="flex" justify="start" align="middle">
          <Col span={2}>
            <Button type="primary" onClick={this.toggleModalVisible} disabled={schedule.lockStatus}>添加商品</Button>
          </Col>
          <Col span={2}>
            {this.usersPopover({
              title: '指定设计',
              disabled: schedule.lockStatus || !hasSelected,
              visible: this.state.desingerPopoverVisible,
              onClick: this.toggleDesingerPopoverVisble,
              onOk: this.onAssignDesingerClick,
              onChange: this.onDesingerChange,
            })}
          </Col>
          <Col span={2}>
            {this.usersPopover({
              title: '指定资料录入',
              disabled: schedule.lockStatus || !hasSelected,
              visible: this.state.maintainerPopoverVisible,
              onClick: this.toggleMaintainerPopoverVisible,
              onOk: this.onAssignMaintainerClick,
              onChange: this.onMaintainerChange,
            })}
          </Col>
        </Row>
        <Table {...this.tableProps()} columns={this.columns()} />
        <If condition={schedule.success}>
          <Modals.ProductLib visible={this.state.modalVisible} suppliers={this.suppliers()} onOk={this.onOkClick} onCancel={this.toggleModalVisible} />
        </If>
        <Modals.Preview visible={this.state.previewModalVisible} url={this.state.previewLink} onCancel={this.togglePreviewModalVisible} title="商品预览" />
      </div>
    );
  }
}
