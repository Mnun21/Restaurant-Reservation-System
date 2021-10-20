import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { seatTable, listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";


/**
 * User selects from a drop down the available tables to seat the reservation
 */
export default function SeatReservation({ loadDashboard, tables }) {

	const history = useHistory();
	const { reservation_id } = useParams();

	const [table_id, setTableId] = useState(0);
	const [reservations, setReservations] = useState([]);
	const [reservationsError, setReservationsError] = useState(null);
	const [errors, setErrors] = useState([]);
	const [apiError, setApiError] = useState(null);

	/**
	 * Makes an API call to get current reservations
	 */
	useEffect(() => {

    	const abortController = new AbortController();

    	setReservationsError(null);

    	listReservations(null, abortController.signal)
      		.then(setReservations)
      		.catch(setReservationsError);

    	return () => abortController.abort();
  	}, []);

	if(!tables || !reservations) return null;

	
	function handleChange({ target }) {
		setTableId(target.value);
	}

	/**
	 * Checks seat status before submission
	 */
	const handleSubmit = (event) => {

		event.preventDefault();
		const abortController = new AbortController();

		if(checkSeat()) {
			seatTable(reservation_id, table_id, abortController.signal)
				.then(loadDashboard)
				.then(() => history.push(`/dashboard`))
				.catch(setApiError);
		}

		return () => abortController.abort();
	}

	/**
	 * Ensures table has enough seats for party
	 */
	const checkSeat = () => {

		const foundErrors = [];

		const foundTable = tables.find((table) => table.table_id === Number(table_id));
		const foundReservation = reservations.find((reservation) => reservation.reservation_id === Number(reservation_id));

		if(!foundTable) {
			foundErrors.push("The table you selected does not exist");
		}
		else if(!foundReservation) {
			foundErrors.push("This reservation does not exist")
		}
		else {
			if(foundTable.status === "occupied") {
				foundErrors.push("The table you selected is currently occupied")
			}

			if(foundTable.capacity < foundReservation.people) {
				foundErrors.push(`The table you selected cannot seat ${foundReservation.people} people.`)
			}
		}

		setErrors(foundErrors);

		return foundErrors.length === 0;
	}

	const tableInfo = () => {
		return tables.map((table) => 
			<option key={table.table_id} value={table.table_id}>{table.table_name} - {table.capacity}</option>);
	};

	const errorsWarning = () => {
		return errors.map((error, idx) => <ErrorAlert key={idx} error={error} />);
	};

	return (

		<form className="form-select">
			{errorsWarning()}
			<ErrorAlert error={apiError} />
			<ErrorAlert error={reservationsError} />

			<label className="display 4" htmlFor="table_id">Choose Table:</label>
			<select 
				className="form-control"
				name="table_id" 
				id="table_id"
				value={table_id}
				onChange={handleChange}
			>
				<option value={0}>Tables</option>
				{tableInfo()}
			</select>

			<button className="btn btn-primary m-1" type="submit" onClick={handleSubmit}>Submit</button>
			<button className="btn btn-danger m-1" type="button" onClick={history.goBack}>Cancel</button>
		</form>

	);
}