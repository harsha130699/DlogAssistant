import React, { useEffect, useState, useRef } from "react";
import socketIOClient from "socket.io-client";
import logo from "./logo.svg";
import "./App.css";
import axios from "./axios";
import AddLog from "./Components/AddLog/AddLog";
import Learnings from "./Components/Learnings/Learnings";
import Quote from "inspirational-quotes";
import Pomodoro from "./Components/Pomodoro/Pomodoro";
import ViewLog from "./Components/VIewLog/ViewLog";
import { Button, Card, Divider } from "antd";
import { Layout } from "antd";
import { Link, Switch, Route, Redirect } from "react-router-dom";
import { Form, Input, Checkbox } from "antd";
import { DlogService, useAuth } from "./Services/dlog.service";

import { useForm } from "antd/lib/form/Form";

const { Header, Footer, Sider, Content } = Layout;
const ENDPOINT = "https://dlogservice.herokuapp.com/";

function DailyQuote() {
  let temp = Quote.getQuote();
  while (temp.text.length > 160) {
    temp = Quote.getQuote();
  }

  let [quote, setQuote] = useState(temp.text);
  let [quoteAuth, setQuoteAuth] = useState(temp.author);
  useEffect(() => {
    const timer = setInterval(() => {
      let temp = Quote.getQuote();
      while (temp.text.length > 160) {
        temp = Quote.getQuote();
      }
      setQuote(temp.text);
      setQuoteAuth(temp.author);
    }, 5000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <div style={{ float: "right", fontSize: "2vh" }}>
      {quote} | {quoteAuth}
    </div>
  );
}

function App() {
  const [logged] = useAuth();
  console.log("It says:"+logged)
  return (
    <div>
      <Layout>
        <Header className="heading">
          <div>Daily Log Assistant </div>
          <DailyQuote />
        </Header>

        <Switch>
          {!logged && <>
            <Route
              path="/DlogAssistant"
              component={() => <LoginComp setLogin={() => console.log(true)} />}
            />
            <Redirect to="/DlogAssistant"/>
          </>}
          {logged && <>
            <Route
              path="/DlogAssistant/dashboard"
              component={() => <LoggedInContent  />}
            />
            <Redirect to="/DlogAssistant/dashboard"/>
          </>}
        </Switch>
      </Layout>
    </div>
  );
}

function Login(props) {
  const [form] = useForm();
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  const onFinish = async (values) => {
    // console.table(form.getFieldsValue(["username","password"]));

    let res = await DlogService.confirmUser(
      form.getFieldsValue(["email", "password"])
    );
    console.log(res);
    if (res.status == 200) {
      props.setLogin();
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  console.log("Login");
  return (
    <Card title="Login Here!" style={{ width: 500 }}>
      <Form
        {...layout}
        form={form}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Username"
          name="email"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
      Login <Link to="/DlogAssistant/dashboard">here</Link>
    </Card>
  );
}

function Register() {
  const [form] = useForm();
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  const onFinish = async (values) => {
    console.log("Success:", values);
    const res = await DlogService.registerUser(
      form.getFieldsValue(["name", "email", "password"])
    );
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  console.log("Login");
  return (
    <Card title="Register Here!" style={{ width: 500 }}>
      <Form
        {...layout}
        name="basic"
        form={form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your mail ID!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[
            { required: true, message: "Please re-enter your password!" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

function LoginComp(props) {

  const [isLogin, setIsLogin] = useState(true);
  return (
    <Content className="loginstyle">
      <div className="center">
        <div className="centerButtons">
          <Button
            type="primary"
            onClick={() => {
              setIsLogin(true);
            }}
          >
            Login
          </Button>{" "}
          <Divider type="vertical" />{" "}
          <Button
            type="primary"
            onClick={() => {
              setIsLogin(false);
            }}
          >
            Register
          </Button>
        </div>
        <div>
          {isLogin ? <Login setLogin={() => props.setLogin()} /> : <Register />}
        </div>
      </div>
    </Content>
  );
}

function LoggedInContent() {
  const [response, setResponse] = useState("");
  let [res, setRes] = useState([]);
  let [learnres, learnsetRes] = useState([]);

  const [counter, setCounter] = useState(0);
  useEffect(async () => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", (data) => {
      setResponse(data);
    });
    let data = await DlogService.getDlogs()
    setRes(data);
    data = await DlogService.getLearnings()
    learnsetRes(data);
    
  }, []);
  
  return (
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
  );
}

export default App;
