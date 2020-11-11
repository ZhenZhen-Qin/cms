import React, { useEffect } from 'react';
import moment from 'moment';
import { Modal, Result, Button, Form, } from 'antd';
import styles from '../style.less';

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
        <Form.Item name="activeName" label="活动标题">
          {current.activeName || ''}
        </Form.Item>
        <Form.Item name="type" label="所属社团">
          {current.communityName}
        </Form.Item>
        <Form.Item name="desc" label="活动描述">
          {current.desc || ''}
        </Form.Item>
        <Form.Item name="activeAddr" label="活动地址">
          {current.activeAddr || ''}
        </Form.Item>
        <Form.Item name="activeAddr" label="参与人数上限">
          {current.upperLimit || ''}
        </Form.Item>
        <Form.Item name="time" label="活动时间">
          开始时间：{!!current.startTime && moment(current.startTime).format('YYYY-MM-DD HH:mm:ss')}
          <br />
          结束时间：{!!current.endTime && moment(current.endTime).format('YYYY-MM-DD HH:mm:ss')}
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
