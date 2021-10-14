import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

export default function CreateTable ( { loadDashboard } ) {
    
    const history = useHistory();

    const [error, setError] = useState([]);
    const [formData, setFormData] = useState({
        table_name: "",
        capacity: 1,
    })

    function handleChange ({ target }) {
        setFormData({ ...formData, [target.name]: target.value })
    }

    function handleSubmit (event) {
        event.preventDefault();

        if (checkFields()) {
            history.push(`/dashboard`);
        }
    }

    function checkFields() {
        let foundError = null;

        if (formData.table_name === "" || formData.capacity === "") {
            foundError = { message: "All fields must be filled out." };
        }
        else if (formData.table_name.length < 2) {
            foundError = { message: "Table name must have at least 2 characters." };
        }

        setError(foundError);

        return foundError.length !== null;

    }

    return (
        <form>

            <ErrorAlert error={error} />

            <label htmlFor="table_name">Table Name:&nbsp;</label>
            <input
                    name="table_name"
                    id="table_name"
                    type="text"
                    minLength="2"
                    onChange={handleChange}
                    value={formData.table_name}
                    required
            />

            <label htmlFor="capacity">Capacity:&nbsp;</label>
            <input
                    name="capacity"
                    id="capacity"
                    type="number"
                    min="1"
                    onChange={handleChange}
                    value={formData.capacity}
                    required 
            />

            <button type="submit" onClick={handleSubmit}>Submit</button>
            <button type="button" onClick={history.goBack}>Cancel</button>

        </form>             
    );
}