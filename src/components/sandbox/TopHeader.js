import React, { useState } from 'react'
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import { 
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined
} from '@ant-design/icons'
import { withRouter } from 'react-router-dom'

const { Header } = Layout
function TopHeader(props) {
    const [collapsed, setCollapsed] = useState(false)
    const changeCollapsed = () => {
        console.log(false)
        setCollapsed(!collapsed)
    }
    const handleClick = (e) => {
        console.log(e, 17)
        if(e.key === 'tmp-1') {
            localStorage.removeItem("token")
            // console.log(props.history)
            props.history.replace("/login")
        }
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
            onClick={(e) => handleClick(e)}
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
export default withRouter(TopHeader)