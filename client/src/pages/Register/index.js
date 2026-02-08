import React, { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Divider from "../../components/Divider";
import { RegisterUser } from "../../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { SetButtonLoading } from "../../redux/loadersSlice";
import { getAntdFormInputRules } from "../../utils/helpers";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const { buttonLoading } = useSelector((state) => state.loaders);
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(SetButtonLoading(true));
      const response = await RegisterUser(values);
      dispatch(SetButtonLoading(false));
      if (response.success) {
        message.success(response.message);
        navigate("/login");
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
      navigate("/");
    }
  }, []);

  return (
    <div className="register-page">
      {/* LEFT PANEL */}
      <div className="register-left">
        <h1>WorkSync</h1>
        <p className="description">
          WorkSync helps teams organize projects, assign responsibilities,
          and monitor progress through a structured and collaborative workflow.
        </p>
        <p className="description">
          Create your account to start managing projects efficiently in one
          centralized platform.
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="register-right">
        <div className="register-card">
          <h2>Create Account</h2>
          <p className="subtitle">
            Set up your workspace and start collaborating
          </p>

          <Divider />

          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={getAntdFormInputRules}
            >
              <Input placeholder="Enter your first name" />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="lastName"
              rules={getAntdFormInputRules}
            >
              <Input placeholder="Enter your last name" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={getAntdFormInputRules}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={getAntdFormInputRules}
            >
              <Input.Password placeholder="Create a password" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              loading={buttonLoading}
              className="register-btn"
            >
              {buttonLoading ? "Creating account..." : "Register"}
            </Button>

            <div className="login-link">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Register;
