import React from "react";

import { useHistory } from "react-router-dom";
import { previous, next, today } from "../utils/date-time";

import ReservationComponent from "./ReservationComponent";
import TableComponent from "./TableComponent";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Display for the dashboard page
 */
function Dashboard({ date, loadDashboard, reservations, reservationsError, tables, tablesError }) {

	const history = useHistory();

	const reservationsInfo = () => {
		return reservations.map((reservation) =>  

			<ReservationComponent key={reservation.reservation_id} reservation={reservation} loadDashboard={loadDashboard} />);
		
		};

	const tablesInfo = () => {
		return tables.map((table) => 
			<TableComponent key={table.table_id} table={table} loadDashboard={loadDashboard} />);
	};

	/**
	 * Allows the user to click on previous and next buttons to view reservations
	 */
	const handleClick = ({ target }) => {
		let newDate;
		let useDate;

		if(!date) {
			useDate = today();
		}
		else {
			useDate = date;
		}

		if(target.name === "previous") {
			newDate = previous(useDate);
		}
		else if(target.name === "next") {
			newDate = next(useDate);
		}
		else {
			newDate = today();
		}

		history.push(`/dashboard?date=${newDate}`);
	}

	return (
		<main>

		
		<h4 className="display 4">Reservations for {date}</h4>

				<button className="btn btn-secondary" type="button" name="previous" onClick={handleClick}>Previous</button>
				<button className="btn btn-info" type="button" name="today" onClick={handleClick}>Today</button>
				<button className="btn btn-secondary" type="button" name="next" onClick={handleClick}>Next</button>
				
		<ErrorAlert error={reservationsError} />

				<table className="table table-hover">
					<thead className="thead-dark">
						<tr>
							<th scope="col">ID</th>
						<th scope="col">First Name</th>
							<th scope="col">Last Name</th>
							<th scope="col">Mobile Number</th>
							<th scope="col">Date</th>
							<th scope="col">Time</th>
							<th scope="col">People</th>
							<th scope="col">Status</th>
							<th scope="col">Edit</th>
							<th scope="col">Cancel</th>
							<th scope="col">Seat</th>
						</tr>
					</thead>
					<tbody>
						{reservationsInfo()}
					</tbody>
				</table>
		
				<br />
				<br />

				<h4 className="display 4">Tables</h4>
		<ErrorAlert error={tablesError} />

				<table className="table table-hover">
					<thead className="thead-dark">
						<tr>
							<th scope="col">Table ID</th>
							<th scope="col">Table Name</th>
							<th scope="col">Capacity</th>
							<th scope="col">Status</th>
							<th scope="col">Reservation ID</th>
							<th scope="col">Finish</th>
						</tr>
					</thead>
					<tbody>
						{tablesInfo()}
					</tbody>
				</table>

		</main>
  	);
}

export default Dashboard;