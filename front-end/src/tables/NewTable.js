import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert"


/**
 * Allows user to create a new table with a name and capacity
 */
export default function NewTable({ loadDashboard }) {

	const history = useHistory();

	const [error, setError] = useState(null);
	const [formData, setFormData] = useState({ table_name: "",
											   capacity: "",
																});

	
	function handleChange({ target }) {
		setFormData({ ...formData, [target.name]: target.name === "capacity" ? Number(target.value) : target.value });
	}

	/**
	 * Ensures entered fields are valid upon submission
	 */
	const handleSubmit = (event) => {

		event.preventDefault();
		const abortController = new AbortController();

		if(checkFields()) {
			createTable(formData, abortController.signal)
				.then(loadDashboard)
				.then(() => history.push(`/dashboard`))
				.catch(setError);
		}

		return () => abortController.abort();
	}

	/**
	 * Ensures fields are entered and name is at min length
	 */
	const checkFields = () => {

		let foundError = null;

		if(formData.table_name === "" || formData.capacity === "") {
			foundError = { message: "Please fill out all fields." };
		}
		else if(formData.table_name.length < 2) {
			foundError = { message: "Table name must be at least 2 characters." };
		}

		setError(foundError);

		return foundError === null;
	}

	return (

		<form>
			<ErrorAlert error={error} />

			<label className="form-label" htmlFor="table_name">Table Name:&nbsp;</label>
			<input 
				className="form-control"
				name="table_name"
				id="table_name"
				type="text"
				minLength={2}
				onChange={handleChange}
				value={formData.table_name}
				required
			/>

			<label className="form-label" htmlFor="capacity">Capacity:&nbsp;</label>
			<input 
				className="form-control"
				name="capacity"
				id="capacity"
				type="number"
				min={1}
				onChange={handleChange}
				value={formData.capacity}
				required
			/>

			<button className="btn btn-primary" type="submit" onClick={handleSubmit}>Submit</button>
			<button className="btn btn-danger" type="button" onClick={history.goBack}>Cancel</button>
		</form>
	);
}