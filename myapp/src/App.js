import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import {Provider} from 'react-redux';
import Home from './components/Home';
import {store,persistor} from './components/store';
import Login from './components/Login';
import Register from './components/Register';
import NotFound from './components/NotFound';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfileSection from './components/ProfileSection';
import { PersistGate } from 'redux-persist/integration/react';
import AcademicWork from './components/AcademicWork';
import ResearchAndDevelopment from './components/ResearchAndDevelopment';
import ContributionsUpload from './components/ContributionsUpload';
import ContributionsForm from './components/ContributionsForm';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <ToastContainer position="top-center" newestOnTop={true} autoClose={1200}/>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path ="/edit-profile" element={<ProfileSection/>}/>
            <Route exact path="/academic-work" element={<ProtectedRoute><AcademicWork/></ProtectedRoute>}/>
            <Route exact path="/research-development" element={<ProtectedRoute><ResearchAndDevelopment/></ProtectedRoute>} />
            <Route exact path="/contributions-upload" element={<ProtectedRoute><ContributionsUpload/></ProtectedRoute>} />
            <Route exact path='/contributions-form-extra' element={<ProtectedRoute><ContributionsForm/></ProtectedRoute>}/>
            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/not-found" />} />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;