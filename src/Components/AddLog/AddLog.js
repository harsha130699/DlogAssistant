import React, { useState, useEffect } from 'react'
import { EnterOutlined } from '@ant-design/icons';
import { List, Typography, Divider } from 'antd';
import { Input, Tooltip, Button } from 'antd';
function AddLog(props) {
    const getLogs = []
    const [currentDlogs, setCurrentDlogs] = useState([])

    useEffect(() => {
        const temp = props.existingLogs.map(log => log.title)
        setCurrentDlogs(temp)

    }, [props])
    const [currLog, setCurrLog] = useState("")
    const handleKeyPress = (target) => {
        console.log("Key pressed")
        if (target.keyCode === 13) {
            console.log("Enter detected")
            addLog()
        }
    }
    const addLog = () => {
        console.log("Adding")
        setCurrentDlogs(currentDlogs => [...currentDlogs,currLog] )
        setCurrLog("")
    }

    const handleLogChange = (e) => {
        setCurrLog(e.target.value)
    }

    return (
        <div className="compStyle">
            <Input value={currLog} onChange={handleLogChange} placeholder="Add Log" onKeyDown={handleKeyPress} />
            <Divider orientation="left">Today's Dlogs</Divider>
            <List
                bordered
                style={{height:"20vh",maxHeight:"20vh",overflowY: 'scroll'}}
                dataSource={currentDlogs}
                renderItem={item => (
                    <List.Item
                    actions={[<a href="http://google.com">Edit</a>, <a href="http://google.com" style={{color:'red'}}>Remove</a>]}
                    >
                        {item}
                    </List.Item>
                    
                )}
            />
        </div>
    )
}

export default AddLog
