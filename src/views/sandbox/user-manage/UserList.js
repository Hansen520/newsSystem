import React, { useState, useEffect, useRef } from 'react'
import { Button, Table, Modal, Switch } from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm'
const { confirm } = Modal

export default function UserList() {
    const [dataSource, setdataSource] = useState([])
    const [isAddVisible, setisAddVisible] = useState(false)
    const [isUpdateVisible, setisUpdateVisible] = useState(false)
    const [roleList, setroleList] = useState([])
    const [regionList, setregionList] = useState([])
    const [current, setcurrent] = useState(null)

    const [isUpdateDisabled, setisUpdateDisabled] = useState(false)
    // useRef 的顺序也很重要
    const addForm = useRef(null)
    const updateForm = useRef(null)
    const { roleId, region, username } = JSON.parse(localStorage.getItem("token"))

    useEffect(() => {
        const roleObj = {
            "1":"superadmin",
            "2":"admin",
            "3":"editor"
        }
        axios.get("http://localhost:5000/users?_expand=role").then(res => {
            const list = res.data
            setdataSource(roleObj[roleId] === "superadmin"?list:[
                ...list.filter(item => item.username === username),
                ...list.filter(item => item.region === region && roleObj[item.roleId] === 'editor')
            ])
        })
    }, [roleId, region, username])

    useEffect(() => {
        axios.get("http://localhost:5000/regions").then(res => {
            const list = res.data
            setregionList(list)
        })
    }, [])

    useEffect(() => {
        axios.get("http://localhost:5000/roles").then(res => {
            const list = res.data
            setroleList(list)
        })
    }, [])

    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            filters: [
                ...regionList.map(item=>({
                    text:item.title,
                    value:item.value
                })),
                {
                    text:"全球",
                    value:"全球"
                }    

            ],
            onFilter:(value,item)=>{
                console.log(value, item, 62)
                if(value==="全球"){
                    return item.region===""
                }
                // 筛选出结果
                return item.region===value
            },
            render: (region) => {
                return <b>{region===""?'全球':region}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render:(role)=>{
                return role?.roleName
            }
        },
        {
            title: "用户名",
            dataIndex: 'username'
        },
        {
            title: "用户状态",
            dataIndex: 'roleState',
            render:(roleState,item)=>{
                return <Switch checked={roleState}  disabled={item.default} onChange={()=>handleChange(item)}></Switch>
            }
        },
        {
            title: "操作",
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)}/>
                    <Button type="primary" shape="circle" icon={<EditOutlined />}  onClick={()=>handleUpdate(item)} disabled={item.default}/>
                </div>
            }
        }
    ]

    const handleChange = (item) => {
        item.roleState = !item.roleState
        setdataSource([...dataSource])

        axios.patch(`http://localhost:5000/users/${item.id}`,{
            roleState:item.roleState
        })
    }

    const confirmMethod = (item) => {
        confirm({
            title: '你确定要删除?',
            icon: <ExclamationCircleOutlined />,
            // content: 'Some descriptions',
            onOk() {
                //   console.log('OK');
                deleteMethod(item)
            },
            onCancel() {
                //   console.log('Cancel');
            },
        });
    }

    const handleUpdate = async(item) => {
            console.log(item, 95)
            await setisUpdateVisible(true)
            if(item.roleId===1){
                //禁用
                setisUpdateDisabled(true)
            }else{
                //取消禁用
                setisUpdateDisabled(false)
            }
            console.log(updateForm)
            updateForm.current.setFieldsValue(item)
        setcurrent(item)
    }

    //删除
    const deleteMethod = (item) => {
        // 当前页面同步状态 + 后端同步
        setdataSource(dataSource.filter(data => data.id!==item.id))
        axios.delete(`http://localhost:5000/users/${item.id}`)
       
    }
    // 确认提交
    const addFormOk = () => {
        addForm.current.validateFields().then(value => {
            setisAddVisible(false)
            //post到后端，生成id，再设置 datasource, 方便后面的删除和更新
            axios.post(`http://localhost:5000/users`, {
                ...value,
                "roleState": true,
                "default": false
            }).then((res) => {
                // 添加数据和角色
                setdataSource([...dataSource, 
                    { 
                        ...res.data,
                        role: roleList.filter(item => item.id === value.roleId)[0]
                    }])
            })
        }).catch((err) => {
            console.log(err)
        })
    }

    // 更新
    const updateFormOK = ()=>{
        updateForm.current.validateFields().then(value => {
            // console.log(value)
            setisUpdateVisible(false)

            setdataSource(dataSource.map(item=>{
                if(item.id===current.id){
                    return {
                        ...item,
                        ...value,
                        role:roleList.filter(data=>data.id===value.roleId)[0]
                    }
                }
                return item
            }))
            setisUpdateDisabled(!isUpdateDisabled)

            axios.patch(`http://localhost:5000/users/${current.id}`,value)
        })
    }

    return (
        <div>
            <Button type="primary" onClick={()=>{
                setisAddVisible(true)
            }}>添加用户</Button>
            <Table dataSource={dataSource} columns={columns}
                pagination={{
                    pageSize: 5
                }} 
                rowKey={item=>item.id}
            />
            <Modal
                visible={isAddVisible}
                title="添加用户"
                okText="确定"
                cancelText="取消"
                onCancel={() => {
                    setisAddVisible(false)
                }}
                onOk={() => {
                    addFormOk()
                }}
            >
                <UserForm regionList={regionList} roleList={roleList}  ref={addForm}></UserForm>
            </Modal>

            <Modal
                visible={isUpdateVisible}
                title="更新用户"
                okText="更新"
                cancelText="取消"
                onCancel={() => {
                    setisUpdateVisible(false)
                    setisUpdateDisabled(!isUpdateDisabled)
                }}
                onOk={() => updateFormOK()}
            >
                <UserForm regionList={regionList} roleList={roleList} ref={updateForm} isUpdateDisabled={isUpdateDisabled}></UserForm>
            </Modal>
        </div>
    )
}
