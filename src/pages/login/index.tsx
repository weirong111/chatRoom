import "./index.scss";
import { Input, Button, Space, Form, Row, Col, message, Card } from "antd";
import { FC, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { reqLogin } from "../utils/xhr";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Loading from "../../components/loading";
const Login: FC = () => {
  const [isLoading, setLoading] = useState(false);
  const nav = useNavigate();
  const onFinish = async (values: any) => {
    const { username, password } = values;
    setLoading(true);
    const result = await reqLogin(username, password);
    setLoading(false);
    if (result.status) {
      message.success(`欢迎您,${result.data.username}`);
      localStorage.setItem("user", JSON.stringify(result.data));
      nav("/home");
      return;
    }
    message.error(result.msg);
  };

  return (
    <div>
      <Row className="login">
        <Loading isLoading={isLoading} />
        <Col className="login_Row" xl={12} sm={20}>
          <h2> weirong聊天室，请登录</h2>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your Username!",
                },
                {
                  min: 2,
                  message: "昵称长度不能小于2",
                },
                {
                  max: 20,
                  message: "昵称长度不能大于20",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
                {
                  min: 8,
                  message: "密码长度不能小于8",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Log in
                </Button>
                Or <Link to={"/register"}>register now!</Link>
              </Space>
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <a className="beian" href="https://beian.miit.gov.cn/">
        闽ICP备2022001986号
      </a>
    </div>
  );
};

export default Login;
