import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd'
import './index.css'
import {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined
} from '@ant-design/icons'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
const { Sider } = Layout

//模拟数组结构
// const  menuList = [
//     {
//       key:"/home",
//       label:"首页",
//       icon:<UserOutlined />
//     },
//     {
//       key:"/user-manage",
//       label:"用户管理",
//       icon:<VideoCameraOutlined />,
//       children:[
//         {
//           key:"/user-manage/list",
//           label:"用户列表",
//           icon:<VideoCameraOutlined />
//         }
//       ]
//     },
//     {
//       key:"/right-manage",
//       label:"权限管理",
//       icon:<UserOutlined />,
//       children:[
//         {
//           key:"/right-manage/role/list",
//           label:"角色列表",
//           icon:<UploadOutlined />
//         },
//         {
//           key:"/right-manage/right/list",
//           label:"权限列表",
//           icon:<UploadOutlined />
//         }
//       ]
//     }
//   ]
const iconList = {
  "/home":<UserOutlined />,
  "/user-manage":<VideoCameraOutlined />,
  "/user-manage/list":<UploadOutlined />,
  "/right-manage":<UserOutlined />,
  "/right-manage/role/list":<VideoCameraOutlined />,
  "/right-manage/right/list":<UploadOutlined />
  //.......
}

function SideMenu(props) {

  const [menu, setMenu] = useState([])
  useEffect(() => {
    axios.get('http://localhost:5000/rights?_embed=children').then((res) => {
      // console.log(res.data)
      setMenu(res.data)
    })
  }, [])
  // const selectKeys = [props.location.pathname]
  
  const handleMenu = (menu) => {
    menu.forEach((item) => {
      item.label = item.title
      item.icon = iconList[item.key]
      delete item.rightId
      if(item.children && item.children.length > 0) {
        handleMenu(item.children)
      } else {
        item.children = ''
      }
    })
  }
  handleMenu(menu)
  

  return (
      <Sider trigger={null} collapsible collapsed={false} >
      <div style={{display:"flex",height:"100%","flexDirection":"column"}}>
        <div className="logo">全球新闻发布管理系统</div>
        <div style={{flex:1,"overflow":"auto"}}>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={
              menu
            }
            onClick={(e) => props.history.push(e.key)}
          >
          </Menu>
        </div>
      </div>
    </Sider>
  )
}

export default withRouter(SideMenu)
