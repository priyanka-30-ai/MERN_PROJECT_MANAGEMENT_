import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetProjectsByRole } from "../../apicalls/projects";
import { SetLoading } from "../../redux/loadersSlice";
import { message } from "antd";
import { getDateFormat } from "../../utils/helpers";
import Divider from "../../components/Divider";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const [projects, setProjects] = useState([]);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

const getData = async () => {
  try {
    dispatch(SetLoading(true));
    const response = await GetProjectsByRole();
    dispatch(SetLoading(false));

    console.log("PROJECT RESPONSE 👉", response);

    if (response.success) {
      setProjects(response.data);
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    dispatch(SetLoading(false));
    message.error(error.message);
  }
};


  useEffect(() => {
    getData();
  }, []);

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === "active").length;
  const completedProjects = projects.filter(p => p.status === "completed").length;

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <h1>
          Welcome back, <span>{user?.firstName}</span> 👋
        </h1>
        <p>
          Manage your projects, track progress, and collaborate efficiently with WorkSync.
        </p>
      </div>

      {/* STATS */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h2>{totalProjects}</h2>
          <span>Total Projects</span>
        </div>
        <div className="stat-card">
          <h2>{activeProjects}</h2>
          <span>Active Projects</span>
        </div>
        <div className="stat-card">
          <h2>{completedProjects}</h2>
          <span>Completed</span>
        </div>
      </div>

      <Divider />

      {/* PROJECTS */}
      <div className="projects-section">
        <h2>Your Projects</h2>

        <div className="projects-grid">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div
                key={project._id}
                className="project-card"
                onClick={() => navigate(`/project/${project._id}`)}
              >
                <h3>{project.name}</h3>
                <Divider />

                <div className="project-meta">
                  <span>
                    <strong>Created:</strong> {getDateFormat(project.createdAt)}
                  </span>
                  <span>
                    <strong>Owner:</strong> {project.owner.firstName}
                  </span>
                  <span className={`status ${project.status}`}>
                    {project.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-projects">
              You haven’t created or joined any projects yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
