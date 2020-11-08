import { Card, Col, Form, List, Row, Select, Typography, Divider, message, Button } from 'antd';
import React, { useEffect, useState } from 'react';

import { connect } from 'umi';
import moment from 'moment';
import AvatarList from './components/AvatarList';
import StandardFormRow from './components/StandardFormRow';
import TagSelect from './components/TagSelect';
import JoinModal from './components/JoinModal';
import DetailModal from './components/DetailModal';
import { communityType } from '../../../utils/common';
import styles from './style.less';
import { LOCAL_STORAGE_KEYS } from '@/utils/enum';
const { Option } = Select;
const FormItem = Form.Item;
const { Paragraph } = Typography;

const getKey = (id, index) => `${id}-${index}`;

const Projects = ({ dispatch, lookCommunity: { list = [] }, loading }) => {
  // 当前值
  const [current, setCurrent] = useState();
  // 控制查看详情弹窗的显示和隐藏
  const [detailVisible, setDetailVisible] = useState();
  const [joinVisible, setJoinVisible] = useState();

  const showDetails = (record) => {
    setCurrent(record);
    setDetailVisible(true);
  };
  const hideDetails = () => {
    setCurrent();
    setDetailVisible(false);
  };
  const showJoin = (record) => {
    setCurrent(record);
    setJoinVisible(true);
  };
  const hideJoin = () => {
    setCurrent();
    setJoinVisible(false);
  };

  useEffect(() => {
    dispatch({
      type: 'lookCommunity/fetch',
      payload: {
        pageSize: 100,
        current: 1,
        communityScreen: '0', // 全部社团,
        userName: localStorage.getItem(LOCAL_STORAGE_KEYS.USER_NAME),
      },
    });
  }, []);

  const joinCommunity = (value) => {
    dispatch({
      type: 'lookCommunity/join',
      payload: {
        communityId: current._id,
        communityName: current.name,
        creatorUserName:current.creatorUserName,
        creatorNickName:current.creatorNickName,
        memberName: localStorage.getItem(LOCAL_STORAGE_KEYS.USER_NAME),
        memberNick: localStorage.getItem(LOCAL_STORAGE_KEYS.NICK_NAME),
        isAdmin:'0',
        reason: value.reason,
        createTime: moment().valueOf(),
        status: '0', // '0' 审核中，‘1’审核通过
      },
    })
      .then((res) => {
        console.log(res);
        if (res.err === -2) {
          message.error('已经提交过申请');
        } else {
          message.success('已提交申请，等待社团管理员审核');
        }
        hideJoin();
      })
      .catch((err) => {
        message.error('操作失败');
        hideJoin();
        console.log(err);
      });
  };

  const cardList = list && (
    <List
      rowKey="id"
      loading={loading}
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 3,
        lg: 3,
        xl: 4,
        xxl: 4,
      }}
      dataSource={list}
      renderItem={(item) => (
        <List.Item>
          <Card
            className={styles.card}
            hoverable
            cover={
              <img
                alt={item.title}
                src={
                  'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1796762658,4159569164&fm=26&gp=0.jpg'
                }
              />
            }
          >
            <Card.Meta
              title={<a>{item.name}</a>}
              description={
                <Paragraph
                  className={styles.item}
                  ellipsis={{
                    rows: 2,
                  }}
                >
                  {item.desc}
                </Paragraph>
              }
            />
            <div>
              <Button type="link" onClick={() => showDetails(item)}>
                查看详情
              </Button>
              <Divider type="vertical" />
              <Button type="link" onClick={() => showJoin(item)}>
                申请加入
              </Button>
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
  const formItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  };
  return (
    <div className={styles.coverCardList}>
      <DetailModal
        current={current}
        visible={detailVisible}
        onCancel={hideDetails}
        onSubmit={async (value) => {
          const success = await joinCommunity(value);

          if (success) {
            hideDetails(false);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      />
      <JoinModal
        // current={current}
        visible={joinVisible}
        onCancel={hideJoin}
        onSubmit={async (value) => {
          const success = await joinCommunity(value);

          if (success) {
            hideJoin(false);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      />
      <Card bordered={false}>
        <Form
          layout="inline"
          onValuesChange={() => {
            // 表单项变化时请求数据
            // 模拟查询表单生效
            dispatch({
              type: 'lookCommunity/fetch',
              payload: {
                pageSize: 100,
                current: 1,
                communityScreen: '0', // 全部社团,
                userName: localStorage.getItem(LOCAL_STORAGE_KEYS.USER_NAME),
              },
            });
          }}
        >
          <StandardFormRow
            title="所属类别"
            block
            style={{
              paddingBottom: 11,
            }}
          >
            <FormItem name="category">
              <TagSelect expandable>
                {communityType &&
                  communityType.map((item, index) => {
                    return (
                      <TagSelect.Option key={index} value={item.value}>
                        {item.label}
                      </TagSelect.Option>
                    );
                  })}
              </TagSelect>
            </FormItem>
          </StandardFormRow>
        </Form>
      </Card>
      <div className={styles.cardList}>{cardList}</div>
    </div>
  );
};

export default connect(({ lookCommunity, loading }) => ({
  lookCommunity,
  loading: loading.models.lookCommunity,
}))(Projects);
