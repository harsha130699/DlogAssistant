import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import logo from './logo.svg';
import './App.css';
import axios from './axios';
import AddLog from './Components/AddLog/AddLog';
import Learnings from './Components/Learnings/Learnings';
import Pomodoro from './Components/Pomodoro/Pomodoro';
import ViewLog from './Components/VIewLog/ViewLog';
import { Card } from 'antd';
import { Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
const ENDPOINT = "https://dlogservice.herokuapp.com/";

function App() {
  const [response, setResponse] = useState("");
  let [res,setRes] = useState([])

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", data => {
      setResponse(data);
    });
    axios.get(`/dlogs`).then(data=>{
      setRes(data.data)
    })

  }, []);
  

  return (
    <div >
      <Layout>
        <Header className='heading'>
          <div>
          It's <time dateTime={response}>{response}</time>
          </div>
      </Header>
        <Content className="App">
          <Card className="eachComp">
            <AddLog existingLogs={res} />

          </Card>
          <Card className="eachComp">
            <Learnings />

          </Card>
          <Card className="eachComp">
            <Pomodoro />

          </Card>
          <Card className="eachComp">
            <ViewLog />

          </Card>
        </Content>
      </Layout>

    </div>
  );
}

export default App;
