import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Modal, Result, Button, Form, DatePicker, Space, Input, InputNumber, Select } from 'antd';
import styles from '../style.less';

import CSelect from '../../../../components/CSelect';
import { communityType } from '../../../../utils/common';
import { value } from 'numeral';
const { TextArea } = Input;
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
      const selectCommunityObj = communityList.filter((item) => item._id === values.communityId)[0];
      onSubmit({
        ...values,
        startTime,
        endTime,
        communityName: selectCommunityObj.name,
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
          name="activeName"
          label="活动标题"
          initialValue="55"
          rules={[
            {
              required: true,
              message: '请输入活动标题',
            },
          ]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          name="communityId"
          label="关联社团"
          initialValue="66"
          rules={[
            {
              required: true,
              message: '请选择关联社团',
            },
          ]}
        >
          <Select placeholder="请选择关联社团">
            {communityList &&
              communityList.map((item) => {
                return <Option value={item._id}>{item.name}</Option>;
              })}
          </Select>
        </Form.Item>
        <Form.Item
          name="createdAt"
          label="活动时间"
          rules={[
            {
              required: true,
              message: '请选择活动时间',
            },
          ]}
        >
          <Space direction="vertical" size={12}>
            <RangePicker
              defaultValue={[moment(current.startTime) || null, moment(current.endTime) || null]}
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              onChange={onChange}
              onOk={onOk}
            />
          </Space>
        </Form.Item>
        <Form.Item name="desc" label="活动描述" initialValue="88">
          <TextArea rows={4} placeholder="请输入" />
        </Form.Item>
        <Form.Item name="upperLimit" label="参与人数上限" initialValue={99}>
          <InputNumber placeholder="不填默认不限制" style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    );
  };

  return (
    <Modal
      title={done ? null : `${current ? '编辑' : '添加'}活动`}
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
