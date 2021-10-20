import React, { useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationComponent from "../dashboard/ReservationComponent";

/**
 * User can search a reservation by number
 */
export default function Search() {
	const [mobileNumber, setMobileNumber] = useState("");
	const [reservations, setReservations] = useState([]);
	const [error, setError] = useState(null);

	function handleChange({ target }) {
		setMobileNumber(target.value);
	}

	/**
	 * Lists reservations given partial or full phone number
	 */
	function handleSubmit(event) {

		event.preventDefault();
		const abortController = new AbortController();

		setError(null);

		listReservations({ mobile_number: mobileNumber }, abortController.signal)
			.then(setReservations)
			.catch(setError);

		return () => abortController.abort();

	}

	const resultsInfo = () => {
		return reservations.length > 0 ?
			reservations.map((reservation) => 
				<ReservationComponent key={reservation.reservation_id} reservation={reservation} />) :
			<tr><td>No reservations found</td></tr>;
	}

	return (

		<div>

			<form>
				<ErrorAlert error={error} />
				<label className="form-label" htmlFor="mobile_number">Enter a customer's phone number:</label>
				<input 
					className="form-control"
					name="mobile_number"
					id="mobile_number"
					type="tel"
					placeholder="Customer's phone number"
					onChange={handleChange}
					value={mobileNumber}
					required
				/>

				<button className="btn btn-primary" type="submit" onClick={handleSubmit}>Find</button>
			</form>
			
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
					{resultsInfo()}
				</tbody>
			</table>

		</div>
	);
}