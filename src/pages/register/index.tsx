import "./index.scss";
import { Input, Button, Space, Form, message, Row, Col } from "antd";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { reqRegister } from "../utils/xhr";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import Loading from "../../components/loading";
import SetAvatar from "../setAvatar";
const Register: FC = () => {
  const [isLoading, setLoading] = useState(false);
  const nav = useNavigate();
  const [avatar, setAvatar] = useState(new Array<string>());
  const [selectedAvatar, setSelectedAvatar] = useState(-1);
  const onFinish = async (values: any) => {
    if (selectedAvatar === -1) {
      message.error("您还没有选择你的头像");
      return;
    }
    const { username, password, email } = values;
    const req = {
      username,
      password,
      email,
      avatarImage: avatar[selectedAvatar],
    };
    setLoading(true);
    const result = await reqRegister(req);
    setLoading(false);
    if (result.status) {
      message.success("您已经成功注册！快去登录吧");
      nav("/");
    } else {
      message.error(result.msg);
    }
  };

  return (
    <Row className="login">
      <Loading isLoading={isLoading} />
      <Col className="login_Row" xl={12} sm={20}>
        <div>
          <h2>请注册</h2>
        </div>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          {/* username */}
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

          {/* password */}
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
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="confirm password"
            />
          </Form.Item>

          {/* email */}
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              prefix={<MailOutlined />}
              className="site-form-item-icon"
              type="email"
              placeholder="email"
            />
          </Form.Item>
          <SetAvatar
            avatar={avatar}
            setAvatar={setAvatar}
            selectedAvatar={selectedAvatar}
            setSelectedAvatar={setSelectedAvatar}
          />
          {/* button */}
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                register in
              </Button>
              Or <Link to={"/"}>login now!</Link>
            </Space>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default Register;
