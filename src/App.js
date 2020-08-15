import React, { useEffect, useState, useRef } from "react";
import socketIOClient from "socket.io-client";
import logo from './logo.svg';
import './App.css';
import axios from './axios';
import AddLog from './Components/AddLog/AddLog';
import Learnings from './Components/Learnings/Learnings';
import Quote from 'inspirational-quotes';
import Pomodoro from './Components/Pomodoro/Pomodoro';
import ViewLog from './Components/VIewLog/ViewLog';
import { Card } from 'antd';
import { Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
const ENDPOINT = "https://dlogservice.herokuapp.com/";

function DailyQuote() {
  let temp = Quote.getQuote()
  while(temp.text.length > 160){
    temp=Quote.getQuote()
  }

  let [quote, setQuote] = useState(temp.text)
  let [quoteAuth, setQuoteAuth] = useState(temp.author)
  useEffect(() => {
    const timer = setInterval(() => {
      const temp = Quote.getQuote()
      while(temp.text.length > 160){
        temp=Quote.getQuote()
      }
      setQuote(temp.text)
      setQuoteAuth(temp.author)

    }, 5000)
    return () => { clearInterval(timer) }
  }, [])
  return (
    <div style={{ float: 'right', fontSize: '2vh' }}>
      {quote} | {quoteAuth}

    </div>
  )
}

function App() {
  const [response, setResponse] = useState("");
  let [res, setRes] = useState([])
  let [learnres, learnsetRes] = useState([])
  

  const [counter, setCounter] = useState(0);
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", data => {
      setResponse(data);
    });
    axios.get(`/dlogs`).then(data => {
      setRes(data.data)
    })
    axios.get(`/learnings`).then(data => {
      learnsetRes(data.data)
    })


  }, []);


  return (
    <div >
      <Layout>
        <Header className='heading'>
          <div>
            Daily Log Assistant
          </div>
        <DailyQuote/>
        </Header>
        <Content className="App">
          <Card className="eachComp">
            <AddLog existingLogs={res} />

          </Card>
          <Card className="eachComp pomoStyle">
            <Pomodoro />


          </Card>
          <Card className="eachComp">
          <Learnings existingLearnings={learnres} />

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
