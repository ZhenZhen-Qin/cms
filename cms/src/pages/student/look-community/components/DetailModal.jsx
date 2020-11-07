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
  const { done, visible, current = {}, onDone, onCancel, onSubmit } = props;
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
    console.log(form);
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
          title="申请加入社团成功"
          subTitle="等待社团管理员审核"
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
        <Form.Item name="name" label="社团名称">
          {current.name || ''}
        </Form.Item>
        <Form.Item name="type" label="社团分类">
          <CSelect placeholder="请选择社团分类" data={communityType} disabled={true}></CSelect>
        </Form.Item>
        <Form.Item name="desc" label="社团简介">
          {current.desc || ''}
        </Form.Item>
        <Form.Item
          name="teacher"
          label="社团指导老师"
        >
          {current.teacher || ''}
        </Form.Item>
      </Form>
    );
  };

  return (
    <Modal
      title="社团详情"
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
    </Modal>
  );
};

export default OperationModal;
