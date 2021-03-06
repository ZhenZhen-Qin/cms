import { Card, Col, Form, List, Row, Select, Typography, Button, Divider, message } from 'antd';
import React, { useEffect, useState } from 'react';
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

const Projects = ({ dispatch, lookActive: { list }, loading }) => {
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
      type: 'lookActive/fetch',
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
                  alt={item.activeName}
                  src={
                    'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1963304009,2816364381&fm=26&gp=0.jpg'
                  }
                />
              }
            >
              <Card.Meta
                title={<a>{item.activeName}</a>}
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
                  参加活动
                </Button>
              </div>
            </Card>
          </List.Item>
        )}
      />
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
  return (
    <div className={styles.coverCardList}>
      <Card bordered={false}>
        <Form
          layout="inline"
          onValuesChange={(value) => {
            // 表单项变化时请求数据
            // 模拟查询表单生效
            dispatch({
              type: 'lookActive/fetch',
              payload: {
                pageSize: 1000,
                current: 1,
                communityScreen: '0',
                communityId: value.selCommunityId,
              },
            });
          }}
        >
          <StandardFormRow title="" grid last>
            <Row gutter={16}>
              <Col lg={8} md={10} sm={10} xs={24}>
                <FormItem {...formItemLayout} label="选择社团" name="selCommunityId">
                  <Select
                    placeholder="请选择"
                    style={{
                      width: 300,
                    }}
                  >
                    {allCommunityList.map((itemObj) => {
                      return <Option value={itemObj._id}>{itemObj.name}</Option>;
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

export default connect(({ lookActive, loading }) => ({
  lookActive,
  loading: loading.models.lookActive,
}))(Projects);
