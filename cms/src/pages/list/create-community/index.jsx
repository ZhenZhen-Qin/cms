/**   
 * 这里是我管理的社团
 * 也就是我可以管理的社团
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
import { queryRule } from './service';

class TableList extends React.Component {
  state = {
    done:false,
    visible:false,
  }
  setDone = (done)=>this.setState({done})
  setVisible = (visible)=>this.setState({visible})



  addCommunity = (params) => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'create_community/addCommunity',
        payload: params
      });
    }

  }
  render() {
    const { done,current,visible,handleDone } = this.state;
    const columns = [
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
        valueData: [{ label: '123', value: '12' }]
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
                handleUpdateModalVisible(true);
                setStepFormValues(record);
              }}
            >
              编辑
          </a>
            <Divider type="vertical" />
            <a href="" style={{color:record.status === 2?'#1890ff':'#999'}}>注销</a> 
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
          onCancel={() => this.setVisible(false)}
          onSubmit={this.addCommunity}
        />
        <ProTable
          headerTitle="查询表格"
          // actionRef={actionRef}
          rowKey="key"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button type="primary" onClick={() => this.setVisible(true)}>
              <PlusOutlined /> 新建
          </Button>,
          ]}
          request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
          columns={columns}
          rowSelection={{
            // onChange: (_, selectedRows) => setSelectedRows(selectedRows),
          }}
        />
      </PageContainer>
    );
  }
};

export default connect(({ loading }) => ({
  submitting: loading.effects['create_community/submitRegularForm'],
}))(TableList);

