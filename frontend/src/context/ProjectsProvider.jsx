import { useState, useEffect, createContext } from 'react';
import axiosClient from '../config/axiosClient';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import useAuth from '../hooks/useAuth';

let socket;

const ProjectsContext = createContext();

const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState({});
  const [alert, setAlert] = useState({});
  const [loading, setLoading] = useState(false);
  const [FormTaskmodal, setFormTaskmodal] = useState(false);
  const [deleteTaskModal, setDeleteTaskModal] = useState(false);
  const [task, setTask] = useState({});
  const [collaborator, setCollaborator] = useState({});
  const [deleteCollaboratorModal, setDeleteCollaboratorModal] = useState(false);
  const [search, setSearch] = useState(false);

  const navigate = useNavigate();
  const { auth } = useAuth();
  useEffect(() => {
    const getProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axiosClient.get('/projects', config);
        setProjects(data);
      } catch (error) {
        console.log(error);
      }
    };
    getProjects();
  }, [auth]);

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);
  }, []);

  const showAlert = (alert) => {
    setAlert(alert);
    setTimeout(() => {
      setAlert({});
    }, 5000);
  };

  const submitProject = async (project) => {
    if (project.id) {
      await editProject(project);
    } else {
      await newProject(project);
    }
  };

  const editProject = async (project) => {
    console.log('edit');
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosClient.put(
        `/projects/${project.id}`,
        project,
        config
      );

      const updatedProjects = projects.map((projectState) =>
        projectState._id === data._id ? data : projectState
      );
      setProjects(updatedProjects);
      setAlert({
        msg: 'Project Updated Correctly',
        erro: false,
      });
      setTimeout(() => {
        setAlert({});
        navigate('/projects');
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const newProject = async (project) => {
    console.log('new');
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axiosClient.post('/projects', project, config);
      setProjects([...projects, data]);

      setAlert({
        msg: 'Project Created',
        erro: false,
      });
      setTimeout(() => {
        setAlert({});
        navigate('/projects');
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const getProject = async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axiosClient(`/projects/${id}`, config);
      setProject(data);
      setAlert({});
    } catch (error) {
      navigate('/projects');
      setAlert({
        msg: error.response.data.msg,
        error: true,
      });
    } finally {
      setLoading(false);
    }

    setTimeout(() => {
      setAlert({});
    }, 3000);
  };

  const deleteProject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axiosClient.delete(`/projects/${id}`, config);

      const updatedProjects = projects.filter((project) => project._id !== id);

      setProjects(updatedProjects);
      setAlert({
        msg: data.msg,
        error: false,
      });
      setTimeout(() => {
        setAlert({});
        navigate('/projects');
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTaskModal = () => {
    setTask({});
    setFormTaskmodal(!FormTaskmodal);
  };

  const handleSearch = () => {
    setSearch(!search);
  };

  const submitTask = async (task) => {
    if (task?.id) {
      editTask(task);
    } else {
      await createTask(task);
    }
  };

  const createTask = async (task) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosClient.post('/tasks', task, config);

      // Add Task to state

      setAlert({});
      setFormTaskmodal(false);

      //SOCKET IO
      socket.emit('new task', data);
    } catch (error) {
      console.log(error);
    }
  };

  const editTask = async (task) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosClient.put(`/tasks/${task.id}`, task, config);

      setAlert({});
      setFormTaskmodal(false);

      //SOCKET IO
      socket.emit('update task', data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditTaskModal = (task) => {
    setTask(task);
    setFormTaskmodal(true);
  };

  const handleDeleteTaskModal = (task) => {
    setTask(task);
    setDeleteTaskModal(!deleteTaskModal);
  };

  const submitColaborator = async (email) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosClient.post(
        '/projects/collaborator',
        { email },
        config
      );
      setCollaborator(data);
      setAlert({});
    } catch (error) {
      setAlert({
        msg: error.response.data.msg,
        error: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const addCollaborator = async (email) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosClient.post(
        `/projects/collaborator/${project._id}`,
        email,
        config
      );
      setAlert({
        msg: data.msg,
        error: false,
      });
      setCollaborator({});
      setTimeout(() => {
        setAlert({});
      }, 3000);
    } catch (error) {
      setAlert({
        msg: error.response.data.msg,
        error: true,
      });
    }
  };

  const deleteTask = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosClient.delete(`/tasks/${task._id}`, config);
      setAlert({ msg: data.msg, error: false });

      setDeleteTaskModal(false);

      //SOCKET IO
      socket.emit('delete task', task);

      setTask({});
      setTimeout(() => {
        setAlert({});
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCollaborator = (collaborator) => {
    setDeleteCollaboratorModal(!deleteCollaboratorModal);
    setCollaborator(collaborator);
    // /delete-collaborator
  };

  const deleteCollaborator = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosClient.post(
        `/projects/delete-collaborator/${project._id}`,
        { id: collaborator._id },
        config
      );

      const updatedProject = { ...project };

      updatedProject.collaborators = updatedProject.collaborators.filter(
        (collaboratorState) => collaboratorState._id !== collaborator._id
      );

      setProject(updatedProject);
      setAlert({
        msg: data.msg,
        error: false,
      });
      setCollaborator({});
      setDeleteCollaboratorModal(false);
      setTimeout(() => {
        setAlert({});
      }, 3000);
    } catch (error) {
      console.log(error.response);
    }
  };

  const changeTaskStatus = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosClient.post(
        `/tasks/status/${id}`,
        {},
        config
      );

      setTask({});
      setAlert({});

      //SOCKET IO
      socket.emit('change status', data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const closeProjectSession = () => {
    setProjects([]);
    setProject({});
    setAlert({});
  };

  //socket io

  const submitTaskIO = (task) => {
    const updatedProject = { ...project };
    updatedProject.tasks = [...updatedProject.tasks, task];
    setProject(updatedProject);
  };

  const deleteTaskIO = (task) => {
    const updatedProject = { ...project };
    updatedProject.tasks = updatedProject.tasks.filter(
      (taskState) => taskState._id !== task._id
    );
    setProject(updatedProject);
  };

  const updateTaskIO = (task) => {
    console.log(task);
    //Update state so component rerender
    const updatedProject = { ...project };
    updatedProject.tasks = updatedProject.tasks.map((taskState) =>
      taskState._id === task._id ? task : taskState
    );
    setProject(updatedProject);
  };

  const changeStatusIO = (task) => {
    const updatedProject = { ...project };
    updatedProject.tasks = updatedProject.tasks.map((taskState) =>
      taskState._id === task._id ? task : taskState
    );
    setProject(updatedProject);
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        showAlert,
        alert,
        submitProject,
        getProject,
        project,
        loading,
        deleteProject,
        FormTaskmodal,
        handleTaskModal,
        submitTask,
        handleEditTaskModal,
        task,
        handleDeleteTaskModal,
        deleteTaskModal,
        deleteTask,
        submitColaborator,
        collaborator,
        addCollaborator,
        handleDeleteCollaborator,
        deleteCollaboratorModal,
        deleteCollaborator,
        changeTaskStatus,
        handleSearch,
        search,
        submitTaskIO,
        deleteTaskIO,
        updateTaskIO,
        changeStatusIO,
        closeProjectSession,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export { ProjectsProvider };

export default ProjectsContext;
