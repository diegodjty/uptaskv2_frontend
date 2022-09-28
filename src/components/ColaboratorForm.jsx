import { useState } from 'react';
import useProjects from '../hooks/useProjects';
import Alert from './Alert';

const ColaboratorForm = () => {
  const [email, setEmail] = useState('');
  const { showAlert, alert, submitColaborator } = useProjects();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === '') {
      showAlert({
        msg: 'Email is required',
        error: true,
      });
      return;
    }
    submitColaborator(email);
  };
  const { msg } = alert;
  return (
    <div>
      <form
        className="bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow"
        onSubmit={handleSubmit}
      >
        {msg && <Alert alert={alert} />}
        <div className="mb-5">
          <label
            htmlFor="name"
            className="text-gray-700 uppercase font-bold text-sm"
          >
            Colaborator Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Colaborator Email"
            className="border-2 w-full p-2 mt-2 placeholder:gray-400 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <input
          type="submit"
          className="bg-sky-600 hover:bg-sky-600 w-full text-white p-3 uppercase font-bold cursor-pointer transition-colors rounded"
          value="Find Colaborator"
        />
      </form>
    </div>
  );
};

export default ColaboratorForm;
