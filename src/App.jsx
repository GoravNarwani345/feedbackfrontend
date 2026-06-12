import React from 'react';
import { BrowserRouter , Routes , Route } from 'react-router-dom';
import CustomerForm from './pages/customerform';
import Sumbit from './pages/Sumbit';
import AdminDashboard from './pages/admindashboard';


const App = () => {
  return (
    
        <BrowserRouter> 

      <Routes>
      
          <Route path="/" element={<CustomerForm />} />
          <Route path="/submit" element={<Sumbit />} />
          <Route path="/admin" element={<AdminDashboard />} />
       
      </Routes>
      </BrowserRouter>
    
  );
}

export default App;