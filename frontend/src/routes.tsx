import React from 'react';

import { Route, Switch } from 'react-router-dom';

import Home from './pages/Home';
import Messages from './pages/Messages';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/dashboard" exact component={Messages} />
      <Route path="/" component={() => <h1>404 NOT FOUND</h1>} />
    </Switch>
  ); 
}