import React from 'react';
import '../../css/general.css';
import '../../css/home/home.css';
import AuthRedirect from '../AuthRedirect';
import SicksManage from './SicksManage';
const HomeDoctor = () => {
  return (
    <AuthRedirect>
      <div className=''>
          <SicksManage />
      </div>
    </AuthRedirect>
  );
};

export default HomeDoctor;