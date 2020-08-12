import React, { useState, useEffect } from 'react'
import { EnterOutlined, ArrowRightOutlined, SyncOutlined } from '@ant-design/icons';
import { List, Typography, Divider } from 'antd';
import { Input, Tooltip, Button } from 'antd';
import axios from '../../axios';
import "./AddLog.css"
import { DlogService } from '../../Services/dlog.service'
function AddLog(props) {
    const getLogs = []
    const [currentDlogs, setCurrentDlogs] = useState([])
    const [refreshSpin, setRefreshSpin] = useState(false)


    useEffect(() => {
        setCurrentDlogs(props.existingLogs)

    }, [props])
    const [currLog, setCurrLog] = useState("")
    const handleKeyPress = (target) => {
        console.log("Key pressed")
        if (target.keyCode === 13) {
            console.log("Enter detected")
            addLog()
        }
    }

    const refresh = async () => {
        setRefreshSpin(true)
        const newDlogs = await DlogService.getDlogs()
        setCurrentDlogs(newDlogs)
        setRefreshSpin(false)
    }
    const addLog = async () => {
        console.log("Adding")
        const item = await DlogService.addDLog(currLog)
        setCurrentDlogs(currentDlogs => [...currentDlogs, item])
        setCurrLog("")

    }

    const handleLogChange = (e) => {
        setCurrLog(e.target.value)

    }
    const handleRemove = async (id) => {
        // console.log(id)
        await DlogService.removeDlog(id)
        await refresh()


    }
    const suffix = (
        <EnterOutlined
            style={{
                fontSize: 16,
                color: '#1890ff',
            }}
        />
    );
    const InputItem = ({item}) => {
        const [IsEditable,setIsEditable] = useState(false)
        const [logText,setLogText] = useState(item.task)
        const handleKeyPress = async (target) => {
            console.log("Key pressed")
            if (target.keyCode === 13) {
                console.log("Enter detected")
                setIsEditable(false); 
                await DlogService.updateDlog(item._id,logText);
                await refresh()
            }
        }
       return ( <List.Item 
            actions={[<div style={{ color: 'blue',width:"10%" ,cursor:"pointer" , display: IsEditable ? 'none':'block' }} onClick={()=>{setIsEditable(true)}}>Edit</div>, <div onClick={() => { handleRemove(item._id) }} style={{ color: 'red', width:"10%" ,cursor: "pointer" }}>Remove</div>]}
        >
            {IsEditable && <Input onKeyDown={handleKeyPress} suffix={<ArrowRightOutlined  onClick={async ()=>{setIsEditable(false); await DlogService.updateDlog(item._id,logText);await refresh() }}/>} value={logText} onChange={(e)=>{setLogText(e.target.value)}} style={{ width: "100%" }} item={item} /> }

            {!IsEditable && <span>{logText}</span>}
        </List.Item>
       )

    }
    return (
        <div className="compStyle">
            <Input allowClear={true} style={{width:'90%'}} value={currLog} onChange={handleLogChange} placeholder="Add Log" suffix={suffix} onKeyDown={handleKeyPress} />
            <SyncOutlined spin={refreshSpin} style={{marginLeft:'1vh' ,fontSize:"3vh"}} onClick={refresh} />
            <Divider orientation="left" >Today's Dlogs </Divider>

            
            <List
                bordered
                style={{ height: "20vh", maxHeight: "20vh", overflowY: 'scroll' }}
                dataSource={currentDlogs}
                renderItem={item => (
                    <InputItem item={item}/>
                    // <div>Hi</div>
                )}
            />
        </div>
    )
}

export default AddLog
