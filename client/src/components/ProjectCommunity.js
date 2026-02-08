import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Input, Button, List, Avatar } from "antd";
import { message } from "antd";
import axios from "axios";

function ProjectCommunity({ projectId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { user } = useSelector((state) => state.users);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/comments/${projectId}`);
      if (response.data.success) setComments(response.data.data);
    } catch (error) {
      message.error(error.message);
    }
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await axios.post("/api/comments", {
        projectId,
        userId: user._id,
        message: newComment,
      });
      if (response.data.success) {
        setComments([...comments, response.data.data]);
        setNewComment("");
      } else throw new Error(response.data.message);
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [projectId]);

  return (
    <div className="project-community">
      <h3>Project Community</h3>
      <List
  dataSource={comments}
  renderItem={(comment) => {
    const user = comment.userId;

    return (
      <List.Item>
        <List.Item.Meta
          avatar={
            <Avatar>
              {user?.firstName ? user.firstName[0] : "?"}
            </Avatar>
          }
          title={
            user
              ? `${user.firstName} ${user.lastName}`
              : "Unknown User"
          }
          description={comment.message}
        />
      </List.Item>
    );
  }}
/>

      <Input.TextArea
        rows={2}
        placeholder="Write a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <Button type="primary" style={{ marginTop: 8 }} onClick={submitComment}>
        Send
      </Button>
    </div>
  );
}

export default ProjectCommunity;
