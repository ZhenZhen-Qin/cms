import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Modal, Result, Button, Form, DatePicker, Space, Input, InputNumber, Select } from 'antd';
import styles from '../style.less';

import CSelect from '../../../../components/CSelect';
import { communityType } from '../../../../utils/common';
import { value } from 'numeral';
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

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
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const { done, visible, current = {}, onDone, onCancel, onSubmit, communityList } = props;
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

  const onChange = function (value, dateString) {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  };

  // 设置活动的开始时间
  const onOk = function (value) {
    console.log('onOk: ', value);
    value[0] && setStartTime(moment(value[0]).valueOf());
    value[1] && setEndTime(moment(value[1]).valueOf());
  };

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = (values) => {
    if (onSubmit) {
      // 取出社团对象
      const selectActiveObj = communityList.filter((item) => item._id === values.activeId)[0];
      onSubmit({
        ...values,
        activeName: selectActiveObj.activeName,
        createTime: moment().valueOf(),
      });
    }
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

    console.log(communityList);
    return (
      <Form {...formLayout} form={form} onFinish={handleFinish}>
        <Form.Item
          name="title"
          label="资讯标题"
          initialValue={current.title}
          rules={[
            {
              required: true,
              message: '请输入资讯标题',
            },
          ]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          name="activeId"
          label="关联活动"
          initialValue={current.activeId}
          rules={[
            {
              required: true,
              message: '请选择关联活动',
            },
          ]}
        >
          <Select placeholder="请选择关联活动">
            {communityList &&
              communityList.map((item) => {
                return <Option value={item._id}>{item.activeName}</Option>;
              })}
          </Select>
        </Form.Item>
        <Form.Item name="content" label="内容" initialValue={current.content}>
          <TextArea rows={4} placeholder="请输入" />
        </Form.Item>
      </Form>
    );
  };

  return (
    <Modal
      title={done ? null : `${current ? '编辑' : '添加'}资讯`}
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
    >
      {getModalContent()}
    </Modal>
  );
};

export default OperationModal;
