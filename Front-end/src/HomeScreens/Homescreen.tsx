import React from 'react';
import LogoArea from './LogoArea';
import RegisterPage from '../Auth/RegisterAccount';


const Homescreen: React.FC = () => {
  return (
    <div>
      <LogoArea />
      <RegisterPage/>
    </div>
  );
};

export default Homescreen;
