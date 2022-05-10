import React from 'react'
import { Layout, Menu } from 'antd'
import './index.css'
import {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined
} from '@ant-design/icons'
import { withRouter } from 'react-router-dom'
const { Sider } = Layout

//模拟数组结构
const  menuList = [
    {
      key:"/home",
      label:"首页",
      icon:<UserOutlined />
    },
    {
      key:"/user-manage",
      label:"用户管理",
      icon:<VideoCameraOutlined />,
      children:[
        {
          key:"/user-manage/list",
          label:"用户列表",
          icon:<VideoCameraOutlined />
        }
      ]
    },
    {
      key:"/right-manage",
      label:"权限管理",
      icon:<UserOutlined />,
      children:[
        {
          key:"/right-manage/role/list",
          label:"角色列表",
          icon:<UploadOutlined />
        },
        {
          key:"/right-manage/right/list",
          label:"权限列表",
          icon:<UploadOutlined />
        }
      ]
    }
  ]


function SideMenu(props) {
    return (
        <Sider trigger={null} collapsible >
        <div className="logo">全球新闻发布管理系统</div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['3']}
          
          items={
            menuList
          }
          onClick={(e) => props.history.push(e.key)}
        >
        </Menu>
      </Sider>
    )
}

export default withRouter(SideMenu)
