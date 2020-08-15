import React, { useState, useEffect } from "react";
import { Form, Select } from "antd";
import {
  EnterOutlined,
  ArrowRightOutlined,
  SyncOutlined,
  PoweroffOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { List, Typography, Divider } from "antd";
import { Input, Tooltip, Button } from "antd";
import axios from "../../axios";
import "./Learnings.css";
import { DlogService } from "../../Services/dlog.service";
import Modal from "antd/lib/modal/Modal";

function Learnings(props) {
  const getLogs = [];
  const [currentDlogs, setCurrentDlogs] = useState([]);
  const [refreshSpin, setRefreshSpin] = useState(false);

  useEffect(() => {
    setCurrentDlogs(props.existingLearnings);
  }, [props]);
  const [currLog, setCurrLog] = useState("");
  const handleKeyPress = (target) => {
    console.log("Key pressed");
    if (target.keyCode === 13) {
      console.log("Enter detected");
      addLog();
    }
  };

  const refresh = async () => {
    setRefreshSpin(true);
    const newDlogs = await DlogService.getLearnings();
    setCurrentDlogs(newDlogs);
    setRefreshSpin(false);
  };
  const addLog = async () => {
    console.log("Adding");
    const item = await DlogService.addDLog(currLog);
    setCurrentDlogs((currentDlogs) => [...currentDlogs, item]);
    setCurrLog("");
  };

  const handleLogChange = (e) => {
    setCurrLog(e.target.value);
  };
  const handleRemove = async (id) => {
    console.log(id);
    await DlogService.removeLearnings(id);
    await refresh();
  };
  const suffix = (
    <EnterOutlined
      style={{
        fontSize: 16,
        color: "#1890ff",
      }}
    />
  );
  const InputItem = ({ item, refresh }) => {
    const [modaledit, setmodaledit] = useState(false);

    return (
      <List.Item
        actions={[
          <div
            style={{
              color: "blue",
              width: "10%",
              cursor: "pointer",
            }}
            onClick={() => {
              setmodaledit(true);
            }}
          >
            Edit
          </div>,
          <div
            onClick={() => {
              handleRemove(item._id);
            }}
            style={{ color: "red", width: "10%", cursor: "pointer" }}
          >
            Remove
          </div>,
        ]}
      >
        <LearningLoader
          setmodal={setmodaledit}
          exists={true}
          item={item}
          refresh={refresh}
          visible={modaledit}
        />

        {<span>{item.learning}</span>}
      </List.Item>
    );
  };
  const [modal, setmodal] = useState(false);
  return (
    <div className="compStyle">
      <Button
        style={{ float: "left", marginBottom: "3vh" }}
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setmodal(true);
        }}
      >
        Add Learning
      </Button>
      <LearningLoader
        setmodal={setmodal}
        refresh={refresh}
        exists={false}
        visible={modal}
      />
      <SyncOutlined
        spin={refreshSpin}
        style={{
          position: "absolute",
          right: "3vh",
          flaot: "right",
          fontSize: "3vh",
        }}
        onClick={refresh}
      />
      <Divider orientation="left">Today's Learnings </Divider>

      <List
        bordered
        style={{ height: "20vh", maxHeight: "20vh", overflowY: "scroll" }}
        dataSource={currentDlogs}
        renderItem={(item) => (
          <InputItem item={item} refresh={refresh} />
          // <div>Hi</div>
        )}
      />
    </div>
  );
}

function LearningLoader(props) {
  const [form] = Form.useForm();
    if(props.exists){
        form.setFieldsValue({
            learning: props.item.learning,
            from: props.item.from,
            incident: props.item.incident,
          });
    }


  const handleOk = async () => {
    props.setmodal(false);
    const addLearning = form.getFieldsValue(["learning", "from", "incident"]);
    if (props.exists) {
      await DlogService.updateLearnings(
        props.item._id,
        addLearning.learning,
        addLearning.from,
        addLearning.incident
      );
    }
    else{
    await DlogService.addLearnings(
      addLearning.learning,
      addLearning.from,
      addLearning.incident
    );
    }
    form.resetFields();

    await props.refresh();
  };

  function handleCancel() {
    props.setmodal(false);
    form.resetFields();
  }

  const onFinish = (values) => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFill = () => {
    form.setFieldsValue({
      learning: "Be grateful for what you have",
      from: "Future self",
      incident: "Life",
    });
  };
  const layout = {
    labelAlign: "left",
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
    colon: false,
  };

  return (
    <Modal
      title="What did you learn today? 😃"
      visible={props.visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Add"
    >
      <Form form={form} name="control-hooks" onFinish={onFinish}>
        <Form.Item
          {...layout}
          name="learning"
          label="Learning"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          {...layout}
          name="from"
          label="From"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          {...layout}
          name="incident"
          label="Incident"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
          <Button type="link" htmlType="button" onClick={onFill}>
            Fill form
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default Learnings;
