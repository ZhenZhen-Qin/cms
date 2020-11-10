import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Popconfirm, Tooltip, Input, Drawer, Radio } from 'antd';
import React, { useState, useRef } from 'react';
import moment from 'moment';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import { communityTypeSelect } from '../../../utils/common';
import { COMMUNITY_SCREEN, LOCAL_STORAGE_KEYS } from '../../../utils/enum';
import UpdateForm from './components/UpdateForm';
import EditModal from './components/EditModal';
import AddAdmin from './components/AddAdmin';

const USER_NAME = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_NAME);
const NICK_NAME = localStorage.getItem(LOCAL_STORAGE_KEYS.NICK_NAME);

import {
  getActiveList,
  addCommunityInfo,
  getCommunityList,
  getAllUserList,
  addCommunityAdmin,
  removeCommunityAdmin,
  updateRule,
  deleteActive,
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
  const [editVisible, setEditVisible] = useState(false); // 编辑
  const [addAdminVisible, setAddAdminVisible] = useState(false); // 管理员管理
  const [updateModalVisible, handleUpdateModalVisible] = useState(false); //
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const [row, setRow] = useState();
  const [current, setCurrent] = useState();
  const [communityList, setCommunityList] = useState([]);
  const [userList, setUserList] = useState([]);

  const [selectAdminObj, setSelectAdminObj] = useState(); // 添加管理员选中

  const [communityScreen, setCommunityScreen] = useState(COMMUNITY_SCREEN.ALL);
  const [selectedRowsState, setSelectedRows] = useState([]);

  // 记录选中的用户 管理员管理
  const changeSelectAdmin = (value, obj) => {
    setSelectAdminObj({
      adminName: value,
      adminNick: obj.nick,
    });
  };

  // 新增
  const showAdd = async () => {
    await queryCommunityList();
    setEditVisible(true);
  };
  // 编辑
  const showEdit = async (record) => {
    await queryCommunityList();
    setEditVisible(true);
    setCurrent(record);
  };

  const hideEdit = () => {
    setEditVisible(false);
    setCurrent();
  };

  const queryCommunityList = (_id) => {
    getCommunityList({
      current: 1,
      pageSize: 10000,
      userName: localStorage.getItem(LOCAL_STORAGE_KEYS.USER_NAME),
    }).then((res) => {
      setCommunityList((res && res.data) || []);
    });
  };

  const queryAllUserList = () => {
    getAllUserList({
      current: 1,
      pageSize: 10000,
    }).then((res) => {
      setUserList((res && res.data) || []);
    });
  };

  const removeAdmin = async (_id) => {
    await removeCommunityAdmin({
      _id, // 这条记录的_id
    }).then((res) => {
      if (res.err === 0) {
        message.success('添加管理员成功');
        queryCommunityList(current._id);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error('操作失败');
      }
    });
  };

  // 管理员 管理
  const showAdmin = (record) => {
    queryCommunityList(record._id);
    queryAllUserList();
    setAddAdminVisible(true);
    setCurrent(record);
  };
  const hideAdmin = (record) => {
    setAddAdminVisible(false);
    setCurrent();
  };

  // 保存 接口请求
  const addAdmin = async () => {
    if (current.creatorUserName === selectAdminObj.adminName) {
      return message.error('你是社团的创建者，不能添加为管理员');
    }
    let params = {
      communityId: current._id,
      communityName: current.name,
      creatorUserName: current.creatorUserName,
      creatorNickName: current.creatorNickName,
      memberName: selectAdminObj.adminName,
      memberNick: selectAdminObj.adminNick,
      isAdmin: '1',
      createTime: moment().valueOf(),
    };

    await addCommunityAdmin(params).then((res) => {
      if (res.err === 0) {
        message.success('添加管理员成功');
        queryCommunityList(current._id);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else if (res.err === -2) {
        message.error('重复添加');
      } else {
        message.error('操作失败，请重试');
      }
    });
  };

  // 添加活动
  const handleAdd = async (fields) => {
    const hide = message.loading('正在添加');
    let options = current
      ? {
          ...current,
          ...fields,
          updateTime: Date.now(),
        }
      : {
          ...fields,
          status: '1',
          createTime: Date.now(),
        };
    options.creatorUserName = USER_NAME;
    options.creatorNickName = NICK_NAME;

    try {
      await addCommunityInfo(options).then((res) => {
        if (res.err === 0) {
          hide();
          message.success(current ? '修改成功' : '添加成功');
          hideEdit();
          if (actionRef.current) {
            actionRef.current.reload();
          }
          return true;
        } else {
          message.error('操作失败请重试！');
        }
      });
    } catch (error) {
      message.error('操作失败请重试！');
      return false;
    }
  };

  // 删除活动
  const removeActive = async (_id) => {
    try {
      await deleteActive({_id}).then((res) => {
        if (res.err === 0) {
          message.success('删除成功');
          if (actionRef.current) {
            actionRef.current.reload();
          }
          return true;
        } else {
          message.error('删除失败请重试！');
          return false;
        }
      });
    } catch (error) {
      hide();
      message.error('操作失败请重试！');
      return false;
    }
  };

  const columns = [
    {
      align: 'center',
      title: '资讯ID',
      dataIndex: '_id',
      tip: '资讯ID是唯一的',
      hideInForm: true,
      ellipsis: true,
    },
    {
      title: '资讯标题',
      dataIndex: 'title',
    },
    {
      title: '关联活动',
      dataIndex: 'activeName',
    },
    {
      align: 'center',
      width: 180,
      title: '活动时间',
      dataIndex: 'createTime',
      render: (text) => moment(parseInt(text)).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      width: 200,
      align: 'center',
      title: '操作',
      dataIndex: 'option',
      render: (_, record) => (
        <>
          <Button
            type="link"
            disabled={record.creatorUserName !== localStorage.getItem(LOCAL_STORAGE_KEYS.USER_NAME)}
            onClick={() => {
              showEdit(record);
              // setStepFormValues(record);
            }}
          >
            编辑
          </Button>
          <Divider type="vertical" />
          <Popconfirm
            title="是否要删除该活动?"
            onConfirm={() => removeActive(record._id)}
            okText="是"
            cancelText="否"
          >
            <Button
              type="link"
              disabled={
                record.creatorUserName !== localStorage.getItem(LOCAL_STORAGE_KEYS.USER_NAME)
              }
            >
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  // 处理社团筛选（全部，我创建的社团或者我管理的社团）
  const handleSizeChange = (e) => {
    console.log(e.target.value);
    e && e.target && e.target.value && setCommunityScreen(e.target.value);
    actionRef.current.reload();
  };

  return (
    <PageContainer>
      <EditModal
        // done={done}
        // onDone={handleDone}
        current={current}
        visible={editVisible}
        onCancel={hideEdit}
        communityList={communityList}
        onSubmit={async (value) => {
          const success = await handleAdd(value);

          if (success) {
            hideEdit();
          }
        }}
      />
      <AddAdmin
        current={current}
        visible={addAdminVisible}
        onCancel={hideAdmin}
        userList={userList}
        changeSelectAdmin={changeSelectAdmin}
        addAdmin={addAdmin}
        removeAdmin={removeAdmin}
        selectAdminObj={selectAdminObj}
      />
      <ProTable
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="_id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type="primary" onClick={() => showAdd()}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={(params, sorter, filter) =>
          getActiveList({ ...params, sorter, filter, communityScreen, userName: USER_NAME })
        }
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
