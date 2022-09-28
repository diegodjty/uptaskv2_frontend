import { useEffect } from 'react';
import ColaboratorForm from '../components/ColaboratorForm';
import useProjects from '../hooks/useProjects';
import { useParams } from 'react-router-dom';
import Alert from '../components/Alert';
const NewColaborator = () => {
  const { getProject, project, loading, collaborator, addCollaborator, alert } =
    useProjects();
  const params = useParams();
  useEffect(() => {
    getProject(params.id);
  }, []);

  if (!project?._id) return <Alert alert={alert} />;
  return (
    <>
      <h1 className="text-4xl font-black">
        Add Colaborator to {project.name} Project
      </h1>
      <div className="mt-10 flex justify-center">
        <ColaboratorForm />
      </div>
      {loading ? (
        <p className="text-center">Loading</p>
      ) : (
        collaborator?._id && (
          <div className="flex justify-center mt-10">
            <div className="bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow">
              <h2 className="text-center mb-10 text-2xl font-bold">Results:</h2>
              <div className="flex justify-between items-center">
                <p>{collaborator.name}</p>
                <button
                  type="button"
                  className="bg-slate-500 px-5 py-2 rounded-lg uppercase text-sm text-white font-bold"
                  onClick={() =>
                    addCollaborator({
                      email: collaborator.email,
                    })
                  }
                >
                  Add To Project
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default NewColaborator;
