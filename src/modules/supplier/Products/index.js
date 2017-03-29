import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import wrapReactLifecycleMethodsWithTryCatch from 'react-component-errors';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Icon, Upload, Row, Col, Select, Tag, Button, DatePicker, Form, Input, message, Table, Popover, Popconfirm } from 'antd';
import Modals from 'modules/Modals';
import moment from 'moment';
import stringcase from 'stringcase';
import { assign, isEmpty, isNaN, map, noop } from 'lodash';
import * as xlsx from "xlsx";
import * as constants from 'constants';
import { fetchProducts, deleteProduct } from 'redux/modules/supplyChain/products';
import { saveProduct, updateProduct, batchCreateProduct } from 'redux/modules/supplyChain/product';
import { fetchFilters } from 'redux/modules/supplyChain/supplierFilters';
import { getStateFilters, setStateFilters } from 'redux/modules/supplyChain/stateFilters';

const propsFiltersName = 'supplierProductList';

const actionCreators = {
  fetchProducts,
  deleteProduct,
  fetchFilters,
  getStateFilters,
  setStateFilters,
  saveProduct,
  updateProduct,
  batchCreateProduct,
};

@connect(
  state => ({
    filters: state.supplierFilters,
    products: state.products,
    stateFilters: state.stateFilters,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

@wrapReactLifecycleMethodsWithTryCatch
class ProductsWithForm extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    location: React.PropTypes.any,
    fetchFilters: React.PropTypes.func,
    fetchProducts: React.PropTypes.func,
    batchCreateProduct: React.PropTypes.func,
    deleteProduct: React.PropTypes.func,
    filters: React.PropTypes.object,
    products: React.PropTypes.object,
    form: React.PropTypes.object,
    stateFilters: React.PropTypes.object,
    getStateFilters: React.PropTypes.func,
    setStateFilters: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'products',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    delSaleProductId: null,
    previewModalVisible: false,
    previewLink: '',
    filters: {
      pageSize: 10,
      page: 1,
      ordering: '-created',
      saleSupplier: this.props.location.query.supplierId,
    },
  }

  componentWillMount() {
    this.props.getStateFilters();
    const { stateFilters } = this.props;
    const filters = stateFilters[propsFiltersName];
    const curSupplierId = this.props.location.query.supplierId;
    if (filters && filters.saleSupplier && filters.saleSupplier === curSupplierId) {
      this.setFilters(filters);
    }
    this.props.fetchProducts(this.getFilters());
    this.props.fetchFilters();
    
  }

  componentWillReceiveProps(nextProps) {
    const { products } = nextProps;
    if (products.failure) {
      message.error(`请求错误: ${products.error.detail || ''}`);
    }

  }

  componentWillUnmount() {
    const { filters } = this.state;
    this.props.setStateFilters(propsFiltersName, filters);
  }

  onCreateProductClick = (e) => {
    const { supplierId } = this.props.location.query;
    this.context.router.push(`/supplier/product/edit?supplierId=${supplierId}`);
  }

  onSubmitClick = (e) => {
    const filters = this.props.form.getFieldsValue();
    const priceRange = filters.priceRange;
    if (priceRange && !isNaN(Number(priceRange.key.split(',')[0]))) {
      filters.minPrice = Number(priceRange.key.split(',')[0]);
    }

    if (priceRange && !isNaN(Number(priceRange.key.split(',')[1]))) {
      filters.maxPrice = Number(priceRange.key.split(',')[1]);
    }

    if (!priceRange.key) {
      filters.minPrice = undefined;
      filters.maxPrice = undefined;
    }

    filters.page = 1;

    this.setFilters(filters);
    this.props.fetchProducts(this.getFilters());
  }

  onHandleExcel = (e)  =>{
        var files = e.target.files;
        console.log(e.target.files[0]);
        var f = e.target.files[0];
        var reader = new FileReader();
        var name = f.name;
        reader.readAsBinaryString(f); 
        reader.onabort = function(e){
          console.log("onbort");
        }
                reader.onloadstart = function(e){
          console.log("onloadstart");
        }
                reader.onprogress = function(e){
          console.log("onprogress");
        }
                reader.onload = function(e){
          console.log("onload");
                    console.log("zheli2");
          var data = e.target.result;
          var workbook = xlsx.read(data,{type:"binary"})
          var sheet_list = workbook.SheetNames;
          console.log(sheet_list[0]);
          var sheet1 = workbook.Sheets[sheet_list[0]];
          xlsx.utils.sheet_to_json(sheet1);
          console.log(sheet2);
          console.log(xlsx.utils.sheet_to_json(sheet1));
          this.props.saveProduct();
          console.log("finish saveProduct");

        }
                reader.onloadend = function(e){
          console.log("onloadend");
        }
                  reader.onerror = function(e){
          console.log("onerror");
        }


  }
  onTableChange = (pagination, filters, sorter) => {
    let ordering = this.state.filters.ordering;
    switch (sorter.order) {
      case 'ascend':
        ordering = stringcase.snakecase(sorter.column.key);
        break;
      case 'descend':
        ordering = `-${stringcase.snakecase(sorter.column.key)}`;
        break;
      default:
        ordering = undefined;
        break;
    }
    this.setFilters({ ordering: ordering });
    this.props.fetchProducts(this.getFilters());
  }

  beforeUpload = (file) => {
       self = this;
        var f = file;
        var reader = new FileReader();
        reader.readAsBinaryString(f); 
        reader.onabort = function(e)
        {
          console.log("onbort");
        }
        reader.onloadstart = function(e)
        {
          console.log("onloadstart");
        }
        reader.onprogress = function(e)
        {
          console.log("onprogress");
        }
        reader.onload = function(e)
        {
          console.log("onload");
          console.log("zheli");
          var data = e.target.result;
          var workbook = xlsx.read(data,{type:"binary"})
          var sheet_list = workbook.SheetNames;
          // console.log(sheet_list[0]);
          var sheet1 = workbook.Sheets[sheet_list[0]];
          xlsx.utils.sheet_to_json(sheet1);
          // console.log(sheet1);
          var data_list = [];
          sheet1=xlsx.utils.sheet_to_json(sheet1);
          for(var i=0;i<sheet1.length;i++){
            // data[i]=i
            data  = {};
            data["supplier_name"] = sheet1[i]["供应商名称"];
            console.log(data["supplier_name"]);
            data["title"] = sheet1[i]["商品名称"];
            data["sale_category_name"] = sheet1[i]["商品类型"];
            data["product_link"] = sheet1[i]["商品链接"];
            data["memo"] = sheet1[i]["备注"];
            data["尺码"] = sheet1[i]["尺码"];
            data["数量"] = sheet1[i]["数量"];
            data["sale_category_1"] = sheet1[i]["类一"];
            data["sale_category_2"] = sheet1[i]["类二"];
            data["sale_category_3"]  = sheet1[i]["类三"];
            data["规格"] = sheet1[i]["规格"];
            data["supplier_sku"] = sheet1[i]["货号"];
            data["source_type"] = sheet1[i]["货物来源"];
            data["price"] = sheet1[i]["进价"];
            data["color"] = sheet1[i]["颜色"];
            data_list.push(data);
          }
            console.log(data_list);
          
          // console.log(xlsx.utils.sheet_to_json(sheet1));

          self.props.batchCreateProduct({"products_list":data_list});

          console.log("finish deleteProduct");
        }
        reader.onloadend = function(e)
        {
          console.log("onloadend");
        }
        reader.onerror = function(e)
        {
          console.log("onerror");
        }
         history.go(0) ;
        return false

  }
  onDeleteConfirm = (e) => {
    const delSaleProductId = this.state.delSaleProductId;
    if (delSaleProductId) {
      this.props.deleteProduct(delSaleProductId, this.getFilters());
      this.setState({ delSaleProductId: null });
    }
  }

  onDeleteClick = (e) => {
    const { id } = e.currentTarget.dataset;
    this.setState({ delSaleProductId: id });
  }

  onPreviewClick = (e) => {
    const { productid, modelid } = e.currentTarget.dataset;
    const { protocol, host } = window.location;
    this.setState({
      previewModalVisible: true,
      previewLink: `${protocol}//${host}/mall/product/details/${modelid}?preview=true`,
    });
  }

  setFilters = (filters) => {
    this.setState(assign(this.state.filters, filters));
  }

  getFilters = () => (this.state.filters)

  getFilterSelectValue = (field) => {
    const fieldValue = this.state.filters[field];
    return fieldValue ? { value: fieldValue } : {};
  }

  formItemLayout = () => ({
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  })

  togglePreviewModalVisible = (e) => {
    this.setState({ previewModalVisible: !this.state.previewModalVisible });
  }

  columns = () => ([{
    title: '图片',
    key: 'picUrl',
    dataIndex: 'picUrl',
    width: 100,
    render: (productPic, record) => {
      const conetnt = (<img style={{ height: '360px' }} src={productPic} role="presentation" />);
      return (
        <Popover placement="right" content={conetnt} trigger="hover">
          <a target="_blank" href={`/admin/pay/modelproduct/${record.modelId}/change/`} title={record.modelId}>
            <img style={{ width: '80px' }} src={productPic} role="presentation" />
          </a>
        </Popover>
      );
    },
  }, {
    title: '商品名称',
    key: 'title',
    dataIndex: 'title',
    width: 200,
    render: (title, record) => (<a target="_blank" href={record.productLink}>{title}</a>),
  }, {
    title: '价格信息',
    key: 'allPrice',
    dataIndex: 'allPrice',
    width: 150,
    render: (text, record) => (
      <div>
        <p><span>售价：￥</span><span>{record.price}</span></p>
        <p><span>吊牌价：￥</span><span>{record.stdSalePrice}</span></p>
        <p><span>采购价：￥</span><span>{record.salePrice}</span></p>
      </div>
    ),
  }, {
    title: '最后上架销售信息',
    key: 'latestFigures',
    dataIndex: 'latestFigures',
    width: 150,
    render: (figures) => (
      <div>
        <p><span>销售额：</span><span>{figures ? `￥${figures.payment.toFixed(2)}` : '-'}</span></p>
        <p><span>退货率：</span><span>{figures ? figures.returnGoodRate : '-'}</span></p>
        <p><span>销售件数：</span><span>{figures ? figures.payNum : '-'}</span></p>
        <p><span>最后上架：</span>{figures ? moment(figures.upshelfTime).format('YYYY-MM-DD') : '-'}</p>
      </div>
    ),
  }, {
    title: '总销售信息',
    key: 'totalFigures',
    dataIndex: 'totalFigures',
    width: 150,
    render: (figures) => (
      <div>
        <p><span>销售额：</span><span>{0}</span></p>
        <p><span>退货率：</span><span>{figures ? figures.totalRgRate : '-'}</span></p>
        <p><span>销售件数：</span><span>0</span></p>
      </div>
    ),
  }, {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    width: 60,
  }, {
    title: '类目',
    key: 'saleCategory',
    dataIndex: 'saleCategory',
    width: 100,
    render: (saleCategory) => (<p>{saleCategory ? saleCategory.fullName : '-'}</p>),
  }, {
    title: '供应商',
    key: 'saleSupplier',
    dataIndex: 'saleSupplier',
    width: 150,
    render: (saleSupplier) => (
      <div>
        <p><span>名称：</span><span>{saleSupplier ? saleSupplier.supplierName : ''}</span></p>
        <p><span>状态：</span><span>{saleSupplier ? saleSupplier.status : ''}</span></p>
        <p><span>进度：</span><span>{saleSupplier ? saleSupplier.progress : ''}</span></p>
      </div>
    ),
  }, {
    title: '录入日期',
    key: 'created',
    dataIndex: 'created',
    width: 100,
    render: (date) => (moment(date).format('YYYY-MM-DD')),
    sorter: true,
  }, {
    title: '操作',
    dataIndex: 'id',
    key: 'operation',
    width: 80,
    render: (id, record) => (
      <ul style={{ display: 'block' }}>
        <li>
          <Link to={`/supplier/product/edit?productId=${id}&supplierId=${this.props.location.query.supplierId}`} >编辑</Link>
        </li>
        <li>
          <Popconfirm placement="left" title={`确认删除(${record.title})吗？`} onConfirm={this.onDeleteConfirm} okText="删除" cancelText="取消">
            <a data-id={id} onClick={this.onDeleteClick}>删除</a>
          </Popconfirm>
        </li>
        <li>
          <a data-productid={id} data-modelid={record.modelId} onClick={this.onPreviewClick} disabled={record.modelId == null} >预览</a>
        </li>
      </ul>
    ),
  }])

  tableProps = () => {
    const self = this;
    const { products } = this.props;
    const { page, pageSize } = this.state.filters;
    return {
      rowKey: (record) => (record.id),
      pagination: {
        total: products.count,
        showTotal: total => `共 ${total} 条`,
        showSizeChanger: true,
        defaultCurrent: page,
        defaultPageSize: pageSize,
        onShowSizeChange(current, curPageSize) {
          self.setFilters({ pageSize: curPageSize, page: current });
          self.props.fetchProducts(self.getFilters());
        },
        onChange(current) {
          self.setFilters({ page: current });
          self.props.fetchProducts(self.getFilters());
        },
      },
      className: 'margin-top-sm',
      dataSource: products.items,
      onChange: this.onTableChange,
      loading: products.isLoading,
    };
  };

 uploadProps = () => {
  return {
  name: 'file',
  action: '/trades/package_order/push_excel',
  headers: {
    authorization: 'authorization-text',
  },
}


  // onChange(info) {
  //   console.log(this.props);
  //   var i;
  //   console.log(info.file.originFileObj);
    // var excelParser = require('excel-parser');
    // const workSheetsFromBuffer = xlsx.parse(info.file);
    // for(var i=0;i!=info.files.length;i++)
    // {
    //   var reader = new FileReader();
    //   console.log(f);
    // }
    // if (info.file.status !== 'uploading') {
    //   console.log(info.file, info.fileList);
    // }
    // if (info.file.status === 'done') {
    //   message.success(`${info.file.name} file uploaded successfully`);
    // } else if (info.file.status === 'error') {
    //   message.error(`${info.file.name} file upload failed.`);
    // }
  // },
};


  render() {
    const { prefixCls, filters, products } = this.props;
    const { getFieldProps } = this.props.form;
    return (
      <div className={`${prefixCls}`} >
        <Form horizontal className="ant-advanced-search-form">
          <Row type="flex" justify="start" align="middle">
            <Col sm={6}>
              <Form.Item label="类目" {...this.formItemLayout()} >
                <Select {...getFieldProps('saleCategory')} {...this.getFilterSelectValue('saleCategory')} labelInValue allowClear placeholder="请选择类目" notFoundContent="无可选项">
                  {map(filters.categorys, (category) => (<Select.Option value={category[0]}>{category[1]}</Select.Option>))}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={6}>
              <Form.Item label="价格范围" {...this.formItemLayout()} >
                <Select {...getFieldProps('priceRange')} {...this.getFilterSelectValue('priceRange')} labelInValue allowClear placeholder="请选择价格区间" notFoundContent="无可选项">
                  {map(constants.priceRanges, (range) => (<Select.Option value={range.value}>{range.lable}</Select.Option>))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start" align="middle">
            <Col span={2}>
              <Button type="primary" onClick={this.onCreateProductClick}>新增商品</Button>
            </Col>
            <Upload {...this.uploadProps()} beforeUpload={this.beforeUpload}>
              <Button>
                <Icon type="upload" /> 货物excel上传
              </Button>
            </Upload>
            <Col span={2} offset={20}>
              <Button type="primary" onClick={this.onSubmitClick}>搜索</Button>
            </Col>
          </Row>
        </Form>
        <Table {...this.tableProps()} columns={this.columns()} />
        <Modals.Preview visible={this.state.previewModalVisible} url={this.state.previewLink} onCancel={this.togglePreviewModalVisible} title="商品预览" />
      </div>
    );
  }
}


export const Products = Form.create()(ProductsWithForm);
