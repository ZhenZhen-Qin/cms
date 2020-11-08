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
  getCommunityList,
  addCommunityInfo,
  getCommunityAdminList,
  getAllUserList,
  addCommunityAdmin,
  removeCommunityAdmin,
  updateStatus,
} from './service';

const TableList = () => {
  const [editVisible, setEditVisible] = useState(false); // 编辑
  const [addAdminVisible, setAddAdminVisible] = useState(false); // 管理员管理
  const [updateModalVisible, handleUpdateModalVisible] = useState(false); //
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const [row, setRow] = useState();
  const [current, setCurrent] = useState();
  const [adminList, setAdminList] = useState([]);
  const [userList, setUserList] = useState([]);

  const [selectAdminObj, setSelectAdminObj] = useState(); // 添加管理员选中

  const [communityScreen, setCommunityScreen] = useState(COMMUNITY_SCREEN.CREATE);
  const [selectedRowsState, setSelectedRows] = useState([]);

  // 记录选中的用户 管理员管理
  const changeSelectAdmin = (value, obj) => {
    setSelectAdminObj({
      memberName: value,
      memberNick: obj.nick,
    });
  };

  // 编辑
  const showEdit = (record) => {
    setEditVisible(true);
    setCurrent(record);
  };

  const hideEdit = () => {
    setEditVisible(false);
    setCurrent();
  };

  const queryCommunityAdminList = (_id) => {
    getCommunityAdminList({
      communityId: _id,
    }).then((res) => {
      setAdminList((res && res.data) || []);
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
        queryCommunityAdminList(current._id);
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
    queryCommunityAdminList(record._id);
    queryAllUserList();
    setAddAdminVisible(true);
    setCurrent(record);
  };
  const hideAdmin = () => {
    setAddAdminVisible(false);
    setCurrent();
  };

  // 保存 接口请求
  // 添加管理员
  const addAdmin = async () => {
    if (current.creatorUserName === selectAdminObj.memberName) {
      return message.error('你是社团的创建者，不能添加为管理员');
    }
    let params = {
      communityId: current._id,
      communityName: current.name,
      creatorUserName: current.creatorUserName,
      creatorNickName: current.creatorNickName,
      memberName: selectAdminObj.memberName,
      memberNick: selectAdminObj.memberNick,
      isAdmin: '0',
      createTime: moment().valueOf(),
    };

    await addCommunityAdmin(params).then((res) => {
      if (res.err === 0) {
        message.success('添加管理员成功');
        queryCommunityAdminList(current._id);
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
    options.creatorUserName = USER_NAME;
    options.creatorNickName = NICK_NAME;

    try {
      await addCommunityInfo(options);
      hide();
      message.success(current ? '修改成功' : '添加成功');
      return true;
    } catch (error) {
      hide();
      message.error('添加失败请重试！');
      return false;
    }
  };

  // 审核学生申请的社团
  const updateMemberStatus = async (params) => {
    try {
      await updateStatus(params).then((res) => {
        if (res.err === 0) {
          message.success('操作成功');
          queryCommunityAdminList(current._id);
        if (actionRef.current) {
          actionRef.current.reload();
        }
        } else {
          message.error('操作失败请重试！');
        }
      });
      return true;
    } catch (error) {
      message.error('操作失败请重试！');
      return false;
    }
  };

  const columns = [
    {
      align: 'center',
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
      dataIndex: 'type',
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
          text: '审核通过',
          status: 'Success',
        },
        3: {
          text: '审核不通过',
          status: 'Error',
        },
      },
    },
    {
      align: 'center',
      width: 180,
      title: '创建时间',
      dataIndex: 'createTime',
      render: (text) => moment(parseInt(text)).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      align: 'center',
      title: '创建者',
      dataIndex: 'creatorNickName',
      render: (text, record) => `${text}（${record.creatorUserName}）`,
    },
    {
      width: 200,
      align: 'center',
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      tip: '只有社团管理员才可以编辑社团',
      render: (_, record) => (
        <>
          {
            // 管理员管理
            record.creatorUserName === localStorage.getItem(LOCAL_STORAGE_KEYS.USER_NAME) && (
              <>
                <Button
                  type="link"
                  onClick={() => {
                    showAdmin(record);
                  }}
                >
                  成员管理
                </Button>
                <Divider type="vertical" />
              </>
            )
          }
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
          <Button
            type="link"
            disabled={record.creatorUserName !== localStorage.getItem(LOCAL_STORAGE_KEYS.USER_NAME)}
          >
            注销
          </Button>
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
        adminList={adminList}
        userList={userList}
        changeSelectAdmin={changeSelectAdmin}
        addAdmin={addAdmin}
        removeAdmin={removeAdmin}
        updateMemberStatus={updateMemberStatus}
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
          <Radio.Group value={communityScreen} onChange={handleSizeChange}>
            <Radio.Button
              value={COMMUNITY_SCREEN.CREATE}
              type={communityScreen === COMMUNITY_SCREEN.CREATE ? 'primary' : 'default'}
            >
              我创建的
            </Radio.Button>
            <Radio.Button
              value={COMMUNITY_SCREEN.MANAGE}
              type={communityScreen === COMMUNITY_SCREEN.MANAGE ? 'primary' : 'default'}
            >
              我管理的
            </Radio.Button>
          </Radio.Group>,
        ]}
        request={(params, sorter, filter) =>
          getCommunityList({ ...params, sorter, filter, communityScreen, userName: USER_NAME })
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
