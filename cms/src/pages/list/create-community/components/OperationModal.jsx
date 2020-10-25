import React, { useEffect } from 'react';
import moment from 'moment';
import { Modal, Result, Button, Form, DatePicker, Input, Select } from 'antd';
import styles from '../style.less';

import CSelect from '../../../../components/CSelect';
import { communityType } from '../../../../utils/common';
import { value } from 'numeral';
const { TextArea } = Input;
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
  const { done, visible, current, onDone, onCancel, onSubmit } = props;
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

  const handleSubmit = () => {
    if (!form) return;
    console.log(form)
    form.submit();
  };

  const handleFinish = (values) => {
    if (onSubmit) {
      onSubmit(values);
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

    return (
      <Form {...formLayout} form={form} onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="社团名称"
          initialValue="111"
          rules={[
            {
              required: true,
              message: '请输入社团名称',
            },
          ]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        {/* <Form.Item
          name="createdAt"
          label="开始时间"
          rules={[
            {
              required: true,
              message: '请选择开始时间',
            },
          ]}
        >
          <DatePicker
            showTime
            placeholder="请选择"
            format="YYYY-MM-DD HH:mm:ss"
            style={{
              width: '100%',
            }}
          />
        </Form.Item> */}
        <Form.Item
          name="typeId"
          label="社团分类"
          initialValue="222"
          rules={[
            {
              required: true,
              message: '请选择社团分类',
            },
          ]}
        >
          <CSelect placeholder="请选择社团分类" data={communityType}></CSelect>
        </Form.Item>
        <Form.Item
          name="desc"
          label="社团简介"
          initialValue="333333333"
          rules={[
            {
              message: '请输入至少五个字符的社团简介！',
              min: 5,
            },
          ]}
        >
          <TextArea rows={4} placeholder="请输入至少五个字符" />
        </Form.Item>
        <Form.Item
          name="teacher"
          label="社团指导老师"
          initialValue="44"
          rules={[
            {
              required: true,
              message: '社团指导老师',
            },
          ]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
      </Form>
    );
  };

  return (
    <Modal
      title={done ? null : `${current ? '编辑' : '添加'}社团`}
      className={styles.standardListForm}
      width={640}
      bodyStyle={
        done
          ? {
            padding: '72px 0',
          }
          : {
            padding: '28px 0 0',
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
