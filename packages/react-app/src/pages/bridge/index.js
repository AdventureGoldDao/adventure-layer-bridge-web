import React from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Row, Col, Button, Flex, Menu, Descriptions, Select, Input, Card } from 'antd';
import './index.css';

const items = [
  {
    key: 'bridge',
    label: 'Bridge',
    icon: <AppstoreOutlined />,
    
  },
  {
    type: 'divider',
  },
  
];

const BridgeIndex = () => {
  const onClick = (e) => {
    console.log('click ', e);
  };
  return (
    <div>

      {/* <div className='left-box'>
        <div className='logo-box'>Adventure Layer</div>

        <div >
          <Menu
            onClick={onClick}
            style={{
              width: 256,
            }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            items={items}
          />
        </div>
      </div> */}


        <div className='right-box'>
          <Row >
            <Col span={12} offset={6}>
              <Card  >
                <p>See transaction history</p>
              </Card>
              <div className='content-box'>
                <div className='from_box' >
                  <div className='f1'>
                    <span>FROM</span>
                    <span>Balance: 0 ETH</span>
                  </div>

                  <div className='input_box'>
                    <Input.Group compact size="large">
                      <Select defaultValue="ETH">
                        <Select.Option value="ETH">ETH</Select.Option>
                        <Select.Option value="ARB">ARB</Select.Option>
                      </Select>
                      <Input
                        style={{
                          width: '80%',
                        }}
                      />
                    </Input.Group>
                  </div>

                </div>

                <div className='to_box'>
                  <div className='t1'>
                    <span>TO</span>
                    <span>Balance: 0 ETH</span>
                  </div>
                  <div className='t2'>
                    <span>Arbitrum One gas fee 0 ETH$0</span>
                  </div>
                </div>

                <div className='summary_box'>
                  <Descriptions title="Summary" column={1}>
                    <Descriptions.Item label="You will pay in gas fees">0.00033 ETH ($0.98)</Descriptions.Item>
                    <Descriptions.Item label="You will receive on Arbitrum One">0 ETH ($0)</Descriptions.Item>
                  </Descriptions>
                </div>

                <Button type="primary" size="large" block>
                  Move funds to Arbitrum One
                </Button>

              </div>
            </Col>
          </Row>
        </div>



    </div>
  );

};
export default BridgeIndex;