import React from 'react';
import { router, routerRedux } from 'umi';
import queryString from 'query-string';
import { getPaginationProps, getParentUrl } from '../utils/utils';

class BaseComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * 加载列表数据函数，继承类请直接覆盖该函数
   */
  loadData() {

  }

  /**
   * 返回上一层路由
   */
  backToParentUrl = () => {
    const { dispatch, location } = this.props;

    if (window.history && window.history.length > 2) {
      dispatch(routerRedux.goBack());
    } else {
      const backUrl = getParentUrl(location);

      if (backUrl) {
        dispatch(routerRedux.push(backUrl));
      }
    }
  }

  /**
   * 将对象参数 Push 到路由
   * @param {object} params URL Query 参数对象
   */
  pushUrlQuery(params) {
    params = params || {};

    const { history, location: { pathname, query } } = this.props;
    const newQuery = {};

    Object.keys(query).forEach(key => {
      // 查询条件表单字段以 f_ 开头，如 f_id
      if (!params.hasOwnProperty(key) && !key.startsWith('f_')) {
        params[key] = query[key];
      }
    });

    Object.keys(params).forEach(key => {
      if (typeof(params[key]) !== 'undefined') {
        newQuery[key] = params[key];
      }
    });

    const search = Object.keys(newQuery).length === 0 ? '' : `?${queryString.stringify(newQuery)}`;

    history.replace({ pathname, search });

    this.loadData(params);
  }

  // 重置表单
  handleFormReset = (e) => {
    const { form } = this.props;

    form.resetFields();

    this.pushUrlQuery({
      current: undefined,
      pageSize: undefined,
      sortField: undefined,
      sortOrder: undefined,
    });
  }

  // 分页排序事件
  handleTableChange = (pagination, filtersArg, sorter) => {
    const { queryForm } = this.state;
    let params = {
      ...queryForm,
    };

    params.current = pagination.current;
    params.pageSize = pagination.pageSize;
    params.sortField = sorter.field;
    params.sortOrder = sorter.order;

    this.pushUrlQuery(params);
  }

  // 获取分页属性
  getPaginationProps = getPaginationProps

}

export default BaseComponent;