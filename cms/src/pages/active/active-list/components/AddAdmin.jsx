/**
 * 添加社团管理员
 */
import React, { useEffect, useState,useRef } from 'react';
import moment from 'moment';
import { Modal, Result, Button, Form, Input, Select, Skeleton, List,Popconfirm, message } from 'antd';
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
    done, visible, current, onDone, onCancel, 
    adminList, userList,
    changeSelectAdmin, addAdmin,removeAdmin,selectAdminObj,
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
          name="adminName"
          label="添加管理员"
          rules={[
            {
              required: true,
              message: '请选择用户',
            },
          ]}
        >
          <Select showSearch placeholder="输入学号搜索" onChange={(e, a) => changeSelectAdmin(e, a)}>
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
            添加管理员
          </Button>
        </Form.Item>
      </Form>
    );
  };

  return (
    <Modal
      title="管理员管理"
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
        <h3>管理员列表</h3>
        <List
          actionRef={actionRef}
          itemLayout="horizontal"
          dataSource={adminList}
          renderItem={(item) => (
            <List.Item actions={[
              <Popconfirm
              title="是否要取消该管理员身份?"
              onConfirm={()=>removeAdmin(item._id)}
              // onCancel={cancel}
              okText="是"
              cancelText="否"
            >
            <a key="list-loadmore-edit">移除</a>
            </Popconfirm>
            ]}>
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  title={
                    <a href="">
                      {item.memberNick}（{item.memberName}）
                    </a>
                  }
                />
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
