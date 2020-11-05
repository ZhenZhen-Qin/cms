import React, { useEffect } from 'react';
import moment from 'moment';
import { Modal, Result, Button, Form, Radio, Input, Select } from 'antd';
import styles from '../style.less';

import CSelect from '../../../../components/CSelect';
import { COMMUNITY_STATUS } from '../../../../utils/enum';
import { communityType } from '../../../../utils/common';
import { value } from 'numeral';
const { TextArea } = Input;
const RadioGroup = Radio.Group;
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
          name="status"
          label="处理方式"
          initialValue={current && current.status || ''}
          rules={[
            {
              required: true,
              message: '处理方式不能为空',
            },
          ]}
        >
          <Radio.Group>
            <Radio value={COMMUNITY_STATUS.PASS}>审核通过</Radio>
            <Radio value={COMMUNITY_STATUS.NO_PASS}>审核不通过</Radio>
            <Radio value={COMMUNITY_STATUS.CANCEL}>注销</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="reason"
          label="理由"
          initialValue={current && current.reason || ''}
          rules={[
            {
              message: '请输入至少五个字符的理由！',
              min: 5,
            },
          ]}
        >
          <TextArea rows={4} placeholder="请输入至少五个字符" />
        </Form.Item>
      </Form>
    );
  };

  return (
    <Modal
      title="审核"
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
