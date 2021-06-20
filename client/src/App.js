import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import MyProjects from './pages/my-projects';
import AddProject from './pages/add-project';
import KanbanBoard from './pages/kanban-board';
import Navbar from './components/navbar';
import ProtectedRoute from './components/auth/protexted-route';

import AuthContextProvider from './context/AuthContext';

const App = () => {
  return (
    <AuthContextProvider>
      <Router>
        <div>
          <Navbar />

          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <ProtectedRoute path='/' exact>
              <MyProjects />
            </ProtectedRoute>

            <ProtectedRoute path='/kanban-board/:projectId' exact>
              <KanbanBoard />
            </ProtectedRoute>

            <ProtectedRoute path='/add-project' exact>
              <AddProject />
            </ProtectedRoute>

            <Route path='/login' exact>
              <Login />
            </Route>
            <Route path='/register' exact>
              <Register />
            </Route>
          </Switch>
        </div>
      </Router>
    </AuthContextProvider>
  );
};

export default App;
