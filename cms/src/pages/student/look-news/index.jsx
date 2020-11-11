import {
  Card,
  Col,
  Form,
  List,
  Row,
  Select,
  Avatar,
  Tag,
  Typography,
  Tooltip,
  Button,
  Divider,
  message,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { LoadingOutlined, StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import moment from 'moment';
import StandardFormRow from './components/StandardFormRow';
import DetailModal from './components/DetailModal';
import JoinModal from './components/JoinModal';
import { LOCAL_STORAGE_KEYS } from '../../../utils/enum';
import styles from './style.less';

import { join, getAllCommunityList } from './service';
import { format } from 'numeral';

const { Option } = Select;
const FormItem = Form.Item;
const { Paragraph } = Typography;

const Projects = ({ dispatch, lookNews: { list }, loading }) => {
  // 当前值
  const [current, setCurrent] = useState();
  const [allCommunityList, setAllCommunityList] = useState([]);
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
      type: 'lookNews/fetch',
      payload: {
        pageSize: 1000,
        current: 1,
        communityScreen: '0',
      },
    });

    getAllCommunityList().then((res) => {
      if (res && res.data && res.data.length > 0) {
        setAllCommunityList(res.data);
      }
    });
  }, []);

  const joinActive = (value) => {
    join({
      activeId: current._id,
      activeName: current.activeName,
      userName: localStorage.getItem(LOCAL_STORAGE_KEYS.USER_NAME),
      userNick: localStorage.getItem(LOCAL_STORAGE_KEYS.NICK_NAME),
      remark: value.remark,
      createTime: moment().valueOf(),
    })
      .then((res) => {
        console.log(res);
        if (res.err === -2) {
          message.error('已经提交过申请');
        } else {
          message.success('已报名');
        }
        hideJoin();
      })
      .catch((err) => {
        message.error('操作失败');
        hideJoin();
        console.log(err);
      });
  };
  const fetchMore = () => {
    dispatch({
      type: 'listAndsearchAndarticles/appendFetch',
      payload: {
        count: pageSize,
      },
    });
  };
  const cardList = list && (
    <>
      <DetailModal current={current} visible={detailVisible} onCancel={hideDetails} />
      <JoinModal
        visible={joinVisible}
        onCancel={hideJoin}
        onSubmit={async (value) => {
          const success = await joinActive(value);

          if (success) {
            hideJoin(false);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      />
      <Card
        style={{
          marginTop: 24,
        }}
        bordered={false}
        bodyStyle={{
          padding: '8px 32px 32px 32px',
        }}
      >
        <List
          size="large"
          loading={list.length === 0 ? loading : false}
          rowKey="id"
          itemLayout="vertical"
          loadMore={loadMore}
          dataSource={list}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              actions={[
                <IconText key="star" type="star-o" text={item.star} />,
                <IconText key="like" type="like-o" text={item.like} />,
                <IconText key="message" type="message" text={item.message} />,
              ]}
              extra={<div className={styles.listItemExtra} />}
            >
              <List.Item.Meta
                title={
                  <a className={styles.listItemMetaTitle} href={item.href}>
                    {item.title}
                  </a>
                }
                description={
                  <>
                    <span>
                      <Tag>{item.activeName}</Tag>
                    </span>
                    <p>{item.content}</p>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </>
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

  const IconText = ({ type, text }) => {
    switch (type) {
      case 'star-o':
        return (
          <span>
            <StarOutlined
              style={{
                marginRight: 8,
              }}
            />
            {text}
          </span>
        );

      case 'like-o':
        return (
          <span>
            <LikeOutlined
              style={{
                marginRight: 8,
              }}
            />
            {text}
          </span>
        );

      case 'message':
        return (
          <span>
            <MessageOutlined
              style={{
                marginRight: 8,
              }}
            />
            {text}
          </span>
        );

      default:
        return null;
    }
  };

  const loadMore = list.length > 0 && (
    <div
      style={{
        textAlign: 'center',
        marginTop: 16,
      }}
    >
      <Button
        onClick={fetchMore}
        style={{
          paddingLeft: 48,
          paddingRight: 48,
        }}
      >
        {loading ? (
          <span>
            <LoadingOutlined /> 加载中...
          </span>
        ) : (
          '加载更多'
        )}
      </Button>
    </div>
  );

  return (
    <div className={styles.coverCardList}>
      <Card bordered={false}>
        <Form
          layout="inline"
          onValuesChange={(value) => {
            // 表单项变化时请求数据
            // 模拟查询表单生效
            dispatch({
              type: 'lookNews/fetch',
              payload: {
                pageSize: 1000,
                current: 1,
                communityScreen: '0',
                activeId: value.selActiveId,
              },
            });
          }}
        >
          <StandardFormRow title="" grid last>
            <Row gutter={16}>
              <Col lg={8} md={10} sm={10} xs={24}>
                <FormItem {...formItemLayout} label="选择活动" name="selActiveId">
                  <Select
                    placeholder="请选择"
                    style={{
                      width: 300,
                    }}
                  >
                    <Option value={undefined}>全部</Option>
                    {allCommunityList.map((itemObj) => {
                      return <Option value={itemObj._id}>{itemObj.activeName}</Option>;
                    })}
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </StandardFormRow>
        </Form>
      </Card>
      <div className={styles.cardList}>{cardList}</div>
    </div>
  );
};

export default connect(({ lookNews, loading }) => ({
  lookNews,
  loading: loading.models.lookNews,
}))(Projects);
