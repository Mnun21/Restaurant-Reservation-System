//React Modules
import React, {useState, useEffect} from "react";
import { Redirect, Route, Switch } from "react-router-dom";

//Tools
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import { listReservations, listTables } from "../utils/api";

//Components
import Dashboard from "../dashboard/Dashboard";
import ReservationsForm from "../reservations/ReservationsForm";
import CreateTable from "../tables/CreateTable";
import SeatReservation from "../reservations/SeatReservation";
import Search from "../search/Search";
import NotFound from "./NotFound";



/**
 * Defines all the routes for the application.
 *
 * @returns {JSX.Element}
 */

function Routes() {

//Variable declarations      
  const query = useQuery();
  const date = query.get("date") ? query.get("date") : today();

  //States
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tableError, setTableError] = useState(null);

//Load API
  useEffect(loadDashboard, [date]);


  function loadDashboard() {

    const abortController = new AbortController();

    setReservationsError(null);
        setTableError(null);

    listReservations({ date: date }, abortController.signal)
        .then(setReservations)
        .catch(setReservationsError);

      listTables(abortController.signal)
          .then((tables) => tables.sort((tableA, tableB) => tableA.table_id - tableB.table_id))
          .then(setTables)
          .catch(setTableError);

    return () => abortController.abort();

  }


  return (
    <Switch>

            <Route exact={true} path="/">
                   <Redirect to={`/dashboard`} />
            </Route>

            <Route exact={true} path="/reservations">
                  <Redirect to={`/dashboard`} />
             </Route>
      
            <Route path="/reservations/new">
                   <ReservationsForm 
                            loadDashboard={loadDashboard}          
                  />
             </Route>

            <Route path="/reservations/:reservation_id/edit">
                    <ReservationsForm
                            loadDashboard={loadDashboard}
                            edit={true}
                            reservations={reservations}

                    />
            </Route>

            <Route path="/reservations/:reservation_id/seat">
                    <SeatReservation
                            tables={tables}
                            loadDashBoard={loadDashboard}
                    />
            </Route>

            <Route path="/tables/new">
                    <CreateTable
                            loadDashboard={loadDashboard}
                    />
            </Route>

            <Route path="/dashboard">
                    <Dashboard
                            date={date}
                            reservations={reservations}
                            reservationsError={reservationsError}
                            tables={tables}
                            tableError={tableError}
                            loadDashboard={loadDashboard}
                    />
            </Route>

            <Route path="/search">
                    <Search />
            </Route>


            <Route>
                    <NotFound />
           </Route>

   </Switch>

  );
}

export default Routes;
