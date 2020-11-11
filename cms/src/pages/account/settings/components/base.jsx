import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Select, Upload, Form, message } from 'antd';
import { connect, FormattedMessage, formatMessage } from 'umi';
import React, { Component } from 'react';
import GeographicView from './GeographicView';
import PhoneView from './PhoneView';
import styles from './BaseView.less';
import { LOCAL_STORAGE_KEYS } from '@/utils/enum';
const { Option } = Select; // 头像组件 方便以后独立，增加裁剪之类的功能
const defaultHeadImg = '/public/img/Default.PNG';
const validatorGeographic = (_, value, callback) => {
  const { province, city } = value;

  if (!province.key) {
    callback('Please input your province!');
  }

  if (!city.key) {
    callback('请选择城市!');
  }

  callback();
};

const validatorPhone = (rule, value, callback) => {
  const values = value.split('-');

  if (!values[0]) {
    callback('Please input your area code!');
  }

  if (!values[1]) {
    callback('请输入手机号码!');
  }

  callback();
};

class BaseView extends Component {
  view = undefined;

  state = {
    currentHeadImg: defaultHeadImg,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'accountAndsettings/getUserInfo',
      payload: {
        userName: localStorage.getItem(LOCAL_STORAGE_KEYS.USER_NAME),
      },
    });
  }

  getAvatarURL() {
    const { currentUser } = this.props;

    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }

      const url = defaultHeadImg;
      return url;
    }

    return '';
  }

  getViewDom = (ref) => {
    this.view = ref;
  };
  handleFinish = (values) => {
    const { currentHeadImg } = this.state;
    const {
      accountAndsettings: { userInfo },
      dispatch,
    } = this.props;
    let params = {
      userName: userInfo.userName, // 用于登录的用户名
      nickName: values.nickName, // 用于显示的昵称
      headImg: currentHeadImg, // 头像地址
      email: values.email, // 邮箱
      profile: values.profile, // 个人简介
      nation: values.nation, // 民族
      mobile: values.mobile, // 手机号
      country: values.country, // 国家
      geographic: JSON.stringify(values.geographic), // 省市
      address: values.address, // 街道地址
      mobile: values.mobile, // 手机号
      college: userInfo.college, // 所在学院 计算机科学与工程学院
      gender: userInfo.gender, // 性别 男male 女female
    };

    console.log(params);
    dispatch({
      type: 'accountAndsettings/update',
      payload: params,
    }).then((res) => {
      console.log(res);
      message.success('更新基本信息成功');
    });
  };

  render() {
    const {
      currentUser,
      accountAndsettings: { userInfo },
      loading,
    } = this.props;
    console.log('loading', loading);
    let that = this;

    const props = {
      name: 'test',
      action: '/upload/upload/img',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 上传成功`);
          if (info && info.file && info.file.response) {
          }
          that.setState({ currentHeadImg: info.file.response.data });
          console.log(info);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 上传失败`);
        }
      },
    };

    const AvatarView = ({ avatar }) => (
      <>
        <div className={styles.avatar_title}>头像</div>
        <div className={styles.avatar}>
          <img src={`http://localhost:3000${userInfo.headImg || currentHeadImg}`} alt="avatar" />
        </div>
        <Upload showUploadList={false} {...props}>
          <div className={styles.button_view}>
            <Button>
              <UploadOutlined />
              更换头像
            </Button>
          </div>
        </Upload>
      </>
    );
    const { currentHeadImg } = this.state;

    return (
      <>
        {!loading && (
          <div className={styles.baseView} ref={this.getViewDom}>
            <div className={styles.left}>
              <Form
                layout="vertical"
                onFinish={this.handleFinish}
                initialValues={currentUser}
                hideRequiredMark
              >
                <Form.Item
                  name="email"
                  initialValue={userInfo.email || undefined}
                  label="邮箱"
                  rules={[
                    {
                      required: true,
                      message: '请输入您的邮箱!',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="nickName"
                  initialValue={userInfo.nickName || undefined}
                  label="昵称"
                  rules={[
                    {
                      required: true,
                      message: '请输入您的昵称!',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="profile"
                  initialValue={userInfo.profile || undefined}
                  label="个人简介"
                  rules={[
                    {
                      required: true,
                      message: '请输入个人简介!',
                    },
                  ]}
                >
                  <Input.TextArea placeholder="个人简介" rows={4} />
                </Form.Item>
                <Form.Item
                  name="country"
                  initialValue={userInfo.country || undefined}
                  label="国家/地区"
                  rules={[
                    {
                      required: true,
                      message: '请输入您的国家或地区!',
                    },
                  ]}
                >
                  <Select
                    style={{
                      maxWidth: 220,
                    }}
                  >
                    <Option value="China">中国</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="geographic"
                  initialValue={userInfo.geographic || undefined}
                  label="所在省市"
                  rules={[
                    {
                      required: true,
                      message: '请输入您的所在省市!',
                    },
                    {
                      validator: validatorGeographic,
                    },
                  ]}
                >
                  <GeographicView />
                </Form.Item>
                <Form.Item
                  name="address"
                  initialValue={userInfo.address || undefined}
                  label="街道地址"
                  rules={[
                    {
                      required: true,
                      message: '请输入您的街道地址!',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="mobile"
                  initialValue={userInfo.mobile || undefined}
                  label="联系电话"
                  rules={[
                    {
                      required: true,
                      message: '请输入您的联系电话!',
                    },
                    {
                      validator: validatorPhone,
                    },
                  ]}
                >
                  <PhoneView />
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit" type="primary">
                    更新基本信息
                  </Button>
                </Form.Item>
              </Form>
            </div>
            <div className={styles.right}>
              <AvatarView avatar={this.getAvatarURL()} />
            </div>
          </div>
        )}
      </>
    );
  }
}

export default connect(({ accountAndsettings, loading }) => ({
  accountAndsettings,
  currentUser: accountAndsettings.currentUser,
  loading: loading.effects['accountAndsettings/getUserInfo'],
}))(BaseView);
