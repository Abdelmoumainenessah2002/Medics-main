import React from 'react';
import '../../css/general.css';
import '../../css/auth.css';
import SearchForDoctor from './SearchForDoctor';
import AuthRedirect from '../AuthRedirect';
const HomeSick = () => {
  document.title = "Medics || Home";
  return (
    <AuthRedirect>
      <div className='pd-y'>
        <SearchForDoctor />
      </div>
    </AuthRedirect>
  );
};

export default HomeSick;








