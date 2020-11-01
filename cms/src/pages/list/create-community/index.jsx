import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import { communityTypeSelect } from '../../../utils/common';
import UpdateForm from './components/UpdateForm';
import OperationModal from './components/OperationModal';

import {
  getCommunityList,
  addCommunityInfo,
  queryRule,
  updateRule,
  addRule,
  removeRule,
} from './service';

/**
 * 添加节点
 * @param fields
 */

/**
 * 更新节点
 * @param fields
 */

const handleUpdate = async (fields) => {
  const hide = message.loading('正在配置');

  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};
/**
 *  删除节点
 * @param selectedRows
 */

const handleRemove = async (selectedRows) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const [row, setRow] = useState();
  const [current, setCurrent] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);

  // 保存
  const handleAdd = async (fields) => {
    const hide = message.loading('正在添加');
    // 社团状态 0:已注销，1:审核中 2:审核通过，3:审核不通过
    let options = current
      ? {
          ...current,
          ...fields,
          updateTime: Date.now(),
        }
      : {
          ...fields,
          status: 1,
          createTime: Date.now(),
        };

    try {
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

  // 点击编辑
  const handleEdit = (record) => {
    handleModalVisible(true);
    setCurrent(record);
  };

  const columns = [
    {
      title: '社团ID',
      dataIndex: '_id',
      hideInForm: true,
      ellipsis: true,
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
      formItemProps: {
        rules: [
          {
            required: true,
            message: '社团类别不能为空',
          },
        ],
      },
      valueEnum: communityTypeSelect,
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
              handleEdit(record);
              // setStepFormValues(record);
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
        // done={done}
        current={current}
        visible={createModalVisible}
        // onDone={handleDone}
        onCancel={() => handleModalVisible(false)}
        onSubmit={async (value) => {
          const success = await handleAdd(value);

          if (success) {
            handleModalVisible(false);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      />
      <ProTable
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="_id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={(params, sorter, filter) => getCommunityList({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项&nbsp;&nbsp;
              <span>
                服务调用次数总计 {selectedRowsState.reduce((pre, item) => pre + item.callNo, 0)} 万
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}

      {/* <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable
          current={current}
          onSubmit={async (value) => {
            const success = await handleAdd(value);

            if (success) {
              handleModalVisible(false);

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="key"
          type="form"
          columns={columns}
        />
      </CreateForm> */}
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);

            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}

      <Drawer
        width={600}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.name && (
          <ProDescriptions
            column={2}
            title={row?.name}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;