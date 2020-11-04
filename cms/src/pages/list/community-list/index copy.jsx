/**
 * 这里是我创建的社团
 * 管理员的社团列表
 */
import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Drawer } from 'antd';
import { connect, FormattedMessage, formatMessage } from 'umi';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import OperationModal from './components/OperationModal';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { getCommunityList, addCommunityInfo } from './service';

/**
 * 添加节点
 * @param fields
 */

const handleAdd = async (fields, current) => {
  const hide = message.loading('正在添加');

  try {
    let options = current ? { ...current, ...fields } : { ...fields };

    await addCommunityInfo(options);
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
class TableList extends React.Component {
  state = {
    done: false,
    visible: false,
    current: undefined,
  };
  setDone = (done) => this.setState({ done });
  setVisible = (visible) => this.setState({ visible });
  setCurrent = (current) => this.setState({ current });

  // 关闭新增弹窗
  closeNewWindow = () => {
    this.setVisible(false);
    this.setCurrent(undefined);
  };

  // 点击编辑
  edit = (record) => {
    this.setVisible(true);
    this.setCurrent(record);
  };

  // 新增或者编辑社团
  addCommunityInfo = (params) => {
    const { dispatch } = this.props;
    const { current } = this.state;
    let options = {};
    if (current) {
      options = {
        ...current,
        ...params,
      };
    }
    if (dispatch) {
      dispatch({
        type: 'create_community/addCommunityInfo',
        payload: options,
      }).then((res) => {
        console.log(res);
        this.actionRef.current.reload(); //刷新表格，触发request属性拉取最新数据
      });
    }
  };
  render() {
    const { done, current, visible, handleDone } = this.state;
    const actionRef = useRef();
    this.actionRef = actionRef;

    const columns = [
      {
        title: '社团ID',
        dataIndex: 'cmId',
      },
      {
        title: '社团名称',
        dataIndex: 'name',
        tip: '社团名称是唯一的',
        formItemProps: {
          rules: [
            {
              required: true,
              message: '社团名称不能为空',
            },
          ],
        },
      },
      {
        title: '社团类别',
        dataIndex: 'typeId',
        valueType: 'select',
        formItemProps: {
          rules: [
            {
              required: true,
              message: '社团类别不能为空',
            },
          ],
        },
        valueData: [{ label: '123', value: '12' }],
      },
      {
        title: '社团指导老师',
        dataIndex: 'teacher',
        formItemProps: {
          rules: [
            {
              required: true,
              message: '社团指导老师不能为空',
            },
          ],
        },
      },
      {
        title: '社团简介',
        dataIndex: 'desc',
        valueType: 'textarea',
      },
      {
        title: '社团状态',
        dataIndex: 'status',
        hideInForm: true,
        valueEnum: {
          0: {
            text: '已注销',
            status: 'Default',
          },
          1: {
            text: '审核中',
            status: 'Processing',
          },
          2: {
            text: '正常',
            status: 'Success',
          },
          3: {
            text: '审核不通过',
            status: 'Error',
          },
        },
      },
      {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        render: (_, record) => (
          <>
            <a
              onClick={() => {
                this.edit(record);
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <a href="" style={{ color: record.status === 2 ? '#1890ff' : '#999' }}>
              注销
            </a>
          </>
        ),
      },
    ];
    return (
      <PageContainer>
        <OperationModal
          done={done}
          current={current}
          visible={visible}
          onDone={handleDone}
          onCancel={this.closeNewWindow}
          onSubmit={this.addCommunityInfo}
        />
        <ProTable
          headerTitle="查询表格"
          actionRef={this.actionRef}
          rowKey="key"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button type="primary" onClick={() => this.setVisible(true)}>
              <PlusOutlined /> 新建
            </Button>,
          ]}
          request={(params, sorter, filter) => getCommunityList({ ...params, sorter, filter })}
          columns={columns}
          rowSelection={
            {
              // onChange: (_, selectedRows) => setSelectedRows(selectedRows),
            }
          }
        />
      </PageContainer>
    );
  }
}

export default connect(({ loading }) => ({
  submitting: loading.effects['create_community/submitRegularForm'],
}))(TableList);
