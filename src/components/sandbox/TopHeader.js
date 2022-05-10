import React, { useState } from 'react'
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import { 
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined
} from '@ant-design/icons'

const { Header } = Layout
export default function TopHeader() {
    const [collapsed, setCollapsed] = useState(false)
    const changeCollapsed = () => {
        console.log(false)
        setCollapsed(!collapsed)
    }
    const menu = (
        <Menu
            items={
            [
                {   
                    label: '超级管理员'
                },
                {   danger: true,
                    label: '退出'
                },
            ]
        }
        >
        </Menu>
    )
    return (
        <Header className='site-layout-background' style={{padding: '0 16px'}}>
            {
                collapsed ?
                    <MenuUnfoldOutlined onClick={changeCollapsed}/>:
                    <MenuFoldOutlined onClick={changeCollapsed}/>
            }
            <div style={{ float: "right" }}>
                <span>欢迎admin回来</span>
                <Dropdown overlay={menu}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>
    )
}
