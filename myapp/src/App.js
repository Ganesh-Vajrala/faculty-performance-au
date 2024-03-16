// App.js
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



function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
    <Router>
      <ToastContainer position="top-center" newestOnTop={true}/>
        <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path ="/edit-profile" element={<ProfileSection/>}/>
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" />} />
        </Routes>
    </Router>
    </PersistGate>
    </Provider>
  );
}

export default App;
