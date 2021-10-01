import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import ReservationsForm from "../reservations/ReservationsForm";
import useQuery from "../utils/useQuery";


/**
 * Defines all the routes for the application.
 *
 * @returns {JSX.Element}
 */

function Routes() {

  const query = useQuery();
  const date = query.get("date") ? query.get("date") : today();

  


  return (
    <Switch>

      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      
     <Route exact={true} path="/reservations/new">
        <ReservationsForm />
      </Route>

      <Route path="/dashboard">
        <Dashboard date={ date } />
      </Route>

      <Route>
        <NotFound />
      </Route>

    </Switch>
  );
}

export default Routes;
