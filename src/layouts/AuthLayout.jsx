import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <>
      <main className="container mx-auto mt-5 md:mt-20 p-5 md:flex md:justify-center">
        <div className="md:w-2/3 lg:w-2/4 xl:w-1/3">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default AuthLayout;
