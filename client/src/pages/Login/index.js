import React, { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { Link } from "react-router-dom";
import Divider from "../../components/Divider";
import { LoginUser } from "../../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { SetButtonLoading } from "../../redux/loadersSlice";
import { getAntdFormInputRules } from "../../utils/helpers";
import "./Login.css";

function Login() {
  const { buttonLoading } = useSelector((state) => state.loaders);
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(SetButtonLoading(true));
      const response = await LoginUser(values);
      dispatch(SetButtonLoading(false));
      if (response.success) {
        localStorage.setItem("token", response.data);
        message.success(response.message);
        window.location.href = "/";
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetButtonLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      window.location.href = "/";
    }
  }, []);

  return (
    <div className="login-page">
      {/* LEFT PANEL */}
      <div className="login-left">
        <h1>WorkSync</h1>
        <p className="description">
          WorkSync is a project management system designed to help teams plan,
          assign, and track tasks efficiently. It provides a structured
          workflow that improves productivity, collaboration, and visibility
          across projects.
        </p>

        <p className="description">
          Teams can manage projects, monitor task progress, and ensure timely
          delivery using a centralized platform.
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right">
        <div className="login-card">
          <h2>Sign In</h2>
          <p className="subtitle">
            Access your workspace and manage your projects
          </p>

          <Divider />

          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item label="Email" name="email" rules={getAntdFormInputRules}>
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={getAntdFormInputRules}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              loading={buttonLoading}
              className="login-btn"
            >
              {buttonLoading ? "Signing in..." : "Login"}
            </Button>

            <div className="register-link">
              Don’t have an account? <Link to="/register">Create one</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
