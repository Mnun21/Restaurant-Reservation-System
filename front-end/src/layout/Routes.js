import React, { useState, useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { listReservations, listTables } from "../utils/api";
import { today } from "../utils/date-time";

import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import useQuery from "../utils/useQuery";
import NewTable from "../tables/NewTable";
import NewReservation from "../reservations/NewReservation"
import SeatReservation from "../reservations/SeatReservation";
import Search from "../search/Search";


/**
 * Defines all the routes
 */
function Routes() {

	const [reservations, setReservations] = useState([]);
	const [reservationsError, setReservationsError] = useState(null);

	const [tables, setTables] = useState([]);
	const [tablesError, setTablesError] = useState(null);

	const query = useQuery();
	const date = query.get("date") ? query.get("date") : today();

	useEffect(loadDashboard, [date]);

	/**
	 * GETs all current reservations and tables
	 */
	function loadDashboard() {

    	const abortController = new AbortController();

    	setReservationsError(null);
		setTablesError(null);

    	listReservations({ date: date }, abortController.signal)
      		.then(setReservations)
      		.catch(setReservationsError);

		listTables(abortController.signal)
			.then((tables) => tables.sort((tableA, tableB) => tableA.table_id - tableB.table_id))
			.then(setTables)
			.catch(setTablesError);

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
				<NewReservation 
					loadDashboard={loadDashboard}
				/>
			</Route>

			<Route path="/reservations/:reservation_id/edit">
				<NewReservation 
					loadDashboard={loadDashboard}
					edit={true}
				/>
			</Route>

			<Route path="/reservations/:reservation_id/seat">
				<SeatReservation
					loadDashboard={loadDashboard}
					tables={tables}
				/>
			</Route>

			<Route path="/tables/new">
				<NewTable 
					loadDashboard={loadDashboard}
				/>
			</Route>

			<Route path="/dashboard">
				<Dashboard 
					loadDashboard={loadDashboard}
					date={date}
					reservations={reservations}
					reservationsError={reservationsError}
					tables={tables}
					tablesError={tablesError}
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