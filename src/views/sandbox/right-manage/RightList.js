import React,{useState,useEffect} from 'react'
import {Button, Table, Tag, Modal, Popover, Switch} from 'antd'
import axios from 'axios'
import {DeleteOutlined,EditOutlined,ExclamationCircleOutlined} from '@ant-design/icons'

const { confirm } = Modal
export default function RightList() {
    const [ dataSource, setDataSource ] = useState([])

    useEffect(() => {
        axios.get("http://localhost:5000/rights?_embed=children").then((res) => {
            const list = res.data
            list.forEach((item) => {
                if(item.children.length === 0) {
                    item.children = ''
                }
            })
            setDataSource(list)
            
        })
    }, [])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '权限名称',
            dataIndex: 'title'
        },
        {
            title:"权限路径",
            dataIndex:'key',
            render: (key) => {
                return <Tag color="orange">{key}</Tag>
            }
        },
        {
            title:"操作",
            render: (item) => (
                <div>
                    <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={() => confirmMethod(item)}></Button>
                    <Popover
                        content={
                            <div style={{textAlign:"center"}}>
                                <Switch
                                    checked={item.pagepermisson}
                                    onChange={()=>switchMethod(item)}
                                ></Switch>
                            </div>
                        }
                        title="页面配置项"
                        trigger={ item.pagepermisson===undefined ? '' : 'click' }>
                            <Button type="primary" shape="circle" icon={<EditOutlined/>}></Button>
                    </Popover>
                    
                </div>
            )
        }
    ]
    const switchMethod = (item) => {
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
        setDataSource([...dataSource])
        // 一级
        if(item.grade === 1) {
            axios.patch(`http://localhost:5000/rights/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        } else {
            axios.patch(`http://localhost:5000/children/${item.id}`,{
                pagepermisson:item.pagepermisson
            })
        }
    }
    // 确认
    const confirmMethod = item => {
        confirm({
            title: '你确定要删除么?',
            icon: <ExclamationCircleOutlined/>,
            onOk() {
                console.log(item, 'ok')
                deleteMethod(item)
            },
            onCancel() {
                console.log('Cancel')
            }
        })
    }
    // 修改
    const deleteMethod = item => {
        if(item.grade === 1) {
            // 与data.id不同的留下来
            setDataSource(dataSource.filter(data => data.id !== item.id))
            axios.delete(`http://localhost:5000/rights/${item.id}`)
        } else {
            // 先获取对应的那一项
            let list = dataSource.filter(data => data.id === item.rightId)
            // 针对那一项进行操作
            list[0].children = list[0].children.filter(data => data.id !== item.id)
            setDataSource([...dataSource])
            axios.delete(`http://localhost:5000/children/${item.id}`)
        }
    }

    return (
        <div>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={{
                    pageSize: 5
                }}
            />
        </div>
    )
}
