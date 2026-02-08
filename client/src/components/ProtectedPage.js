import { message, Avatar, Badge, Dropdown, Menu, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetLoggedInUser } from "../apicalls/users";
import { SetNotifications, SetUser } from "../redux/usersSlice";
import { SetLoading } from "../redux/loadersSlice";
import { GetAllNotifications } from "../apicalls/notifications";
import Notifications from "./Notifications";

function ProtectedPage({ children }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, notifications } = useSelector((state) => state.users);

  const getUser = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetLoggedInUser();
      dispatch(SetLoading(false));
      if (response.success) {
        dispatch(SetUser(response.data));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const getNotifications = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllNotifications();
      dispatch(SetLoading(false));
      if (response.success) {
        dispatch(SetNotifications(response.data));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUser();
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (user) {
      getNotifications();
    }
  }, [user]);

  const userMenu = (
    <Menu>
      <Menu.Item onClick={() => navigate("/profile")}>
        My Profile
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    user && (
      <div>
        {/* HEADER */}
        <div className="flex justify-between items-center bg-white px-6 py-4 shadow-sm border-b">
          {/* Left */}
          <h1
            className="text-2xl font-bold text-primary cursor-pointer"
            onClick={() => navigate("/")}
          >
            WorkSync
          </h1>

          {/* Right */}
          <div className="flex items-center gap-6">
            

            <Badge
              count={
                notifications.filter((n) => !n.read).length
              }
              className="cursor-pointer"
            >
              <Avatar
                size="large"
                icon={<i className="ri-notification-3-line"></i>}
                onClick={() => setShowNotifications(true)}
              />
            </Badge>

            <Dropdown overlay={userMenu} placement="bottomRight">
              <span className="cursor-pointer font-medium">
                {user.firstName} ⌄
              </span>
            </Dropdown>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="px-6 py-4 bg-gray-50 min-h-screen">
          {children}
        </div>

        {/* NOTIFICATIONS MODAL */}
        {showNotifications && (
          <Notifications
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            reloadNotifications={getNotifications}
          />
        )}
      </div>
    )
  );
}

export default ProtectedPage;
