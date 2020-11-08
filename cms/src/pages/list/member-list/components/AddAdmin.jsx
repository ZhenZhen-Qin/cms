/**
 * 添加社团管理员
 */
import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import {
  Modal,
  Result,
  Button,
  Form,
  Input,
  Select,
  Skeleton,
  List,
  Popconfirm,
  Radio,
  message,
} from 'antd';
import styles from '../style.less';

import CSelect from '../../../../components/CSelect';
import { communityType } from '../../../../utils/common';
import { value } from 'numeral';
import { addCommunityAdmin, getAllUserList } from '../service';
import { add } from 'lodash';
const { TextArea } = Input;
const { Option } = Select;
const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const OperationModal = (props) => {
  const [form] = Form.useForm();
  const actionRef = useRef();
  const {
    done,
    visible,
    current,
    onDone,
    onCancel,
    adminList,
    userList,
    changeSelectAdmin,
    addAdmin,
    removeAdmin,
    updateMemberStatus,
    selectAdminObj,
  } = props;
  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
    }
  }, [props.visible]);
  useEffect(() => {
    if (current) {
      form.setFieldsValue({
        ...current,
        createdAt: current.createdAt ? moment(current.createdAt) : null,
      });
    }
  }, [props.current]);

  // 接口  请求所有用户和该社团的管理员
  const handleSubmit = () => {
    if (!form) return;
    console.log(form);
    form.submit();
  };

  const handleFinish = (values) => {
    addAdmin(values);
  };

  const modalFooter = done
    ? {
        footer: null,
        onCancel: onDone,
      }
    : {
        okText: '保存',
        onOk: handleSubmit,
        onCancel,
      };

  const getModalContent = () => {
    if (done) {
      return (
        <Result
          status="success"
          title="操作成功"
          subTitle="创建社团成功，等待审核"
          extra={
            <Button type="primary" onClick={onDone}>
              知道了
            </Button>
          }
          className={styles.formResult}
        />
      );
    }

    return (
      <Form {...formLayout} form={form} onFinish={handleFinish}>
        <Form.Item
          name="memberName"
          label="添加社团成员"
          rules={[
            {
              required: true,
              message: '请选择学生',
            },
          ]}
        >
          <Select
            showSearch
            placeholder="输入学号搜索"
            onChange={(e, a) => changeSelectAdmin(e, a)}
          >
            {userList.map((item, index) => {
              return (
                <Option
                  value={item.userName}
                  nick={item.nickName}
                  key={item._id}
                >{`${item.nickName}（${item.userName}）`}</Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="  " colon={false}>
          <Button type="primary" onClick={addAdmin} disabled={!selectAdminObj}>
            添加成员
          </Button>
        </Form.Item>
      </Form>
    );
  };

  return (
    <Modal
      title="社团成员管理"
      className={styles.standardListForm}
      width={640}
      bodyStyle={
        done
          ? {
              padding: '72px 0',
            }
          : {
              padding: '28px 0',
            }
      }
      destroyOnClose
      visible={visible}
      {...modalFooter}
      footer={false}
    >
      {getModalContent()}
      <div style={{ padding: '0px 48px' }}>
        <h3>社团成员列表</h3>
        <List
          actionRef={actionRef}
          itemLayout="horizontal"
          dataSource={adminList}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                item.status === '0' ? (
                  <a
                    key="list-loadmore-edit"
                    onClick={() => {
                      Modal.info({
                        title: '审核',
                        content: (
                          <>
                            <p>申请理由：{item.reason}</p>
                            <Form form={form}>
                              <Form.Item
                                name="reviewWay"
                                label="添加社团成员"
                                rules={[
                                  {
                                    required: true,
                                    message: '请选择学生',
                                  },
                                ]}
                              >
                                <Radio.Group defaultValue="1">
                                  <Radio value="1">通过</Radio>
                                  <Radio value="2">不通过</Radio>
                                </Radio.Group>
                              </Form.Item>
                            </Form>
                          </>
                        ),
                        onOk: () => {
                          const params = {
                            ...item,
                            status: form.getFieldValue('reviewWay'),
                          };
                          updateMemberStatus(params);
                        },
                        onOkText: '确定',
                      });
                    }}
                  >
                    审核
                  </a>
                ) : (
                  <Popconfirm
                    title="是否要取消该管理员身份?"
                    onConfirm={() => removeAdmin(item._id)}
                    // onCancel={cancel}
                    okText="是"
                    cancelText="否"
                  >
                    {console.log(item)}
                    <a key="list-loadmore-edit">移除</a>
                  </Popconfirm>
                ),
              ]}
            >
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  title={
                    <a href="">
                      <span style={{ marginRight: 16 }}>{index + 1}</span>
                      {item.memberNick}（{item.memberName}）
                    </a>
                  }
                />
                {item.isAdmin === '1' && <span style={{ marginRight: 16 }}>管理员</span>}
                {item.status === '2' && <span style={{ marginRight: 16 }}>审核不通过</span>}
                {item.status === '1' && <span style={{ marginRight: 16 }}>审核通过</span>}
                {item.status === '0' && <span style={{ marginRight: 16 }}>待审核</span>}
                <div>{moment(item.createTime * 1).format('YYYY-MM-DD HH:mm:ss')}</div>
              </Skeleton>
            </List.Item>
          )}
        />
      </div>
    </Modal>
  );
};

export default OperationModal;
