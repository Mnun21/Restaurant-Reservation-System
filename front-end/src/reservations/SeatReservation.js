import React, { useState, useEffect }from "react";
import { useHistory, useParams } from "react-router";
import { seatTable, listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";



export default function SeatReservation ({ tables, loadDashboard}) {

    const [table_id, setTableId] = useState(0);
    const [errors, setErrors] = useState([]);
    const [apiError, setApiError] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);
    
    const { reservation_id } = useParams();
    const history = useHistory();

    useEffect(() => {
        const abortController = new AbortController();

        setReservationsError(null);

        listReservations(null, abortController.signal)
                .then(setReservations)
                .catch(setReservationsError);
        
        return () => abortController.abort();

    }, []);

    if (!tables || !reservations) return null;

    const handleChange = ({ target }) => {
        setTableId(target.value);
    }

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

    const checkSeat = () => {
        const foundErrors = [];

        const foundTable = tables.find((table) => table.table_id === Number(table_id));
        const foundReservation = reservations.find((reservation) => reservation.reservation_id === Number(reservation_id));

        if (!foundTable) {
            foundErrors.push("The table you selected does not exist.")
        }
        else if (!foundReservation) {
            foundErrors.push("This reservation does not exist.")
        }
        else {
            if (foundTable.status === "occupied") {
                foundErrors.push("The table is currently occupied.")
            }

            if (foundTable.capacity < foundReservation.people) {
                foundErrors.push(`The table you selected cannot seat ${foundReservation.people} people.`)
            }
        }

        setErrors(foundErrors);

        return foundErrors.length === 0;

    }

    const tableOptions = () => {
        return tables.map((table) => <option key={table.table_id} value={table.table_id}>{table.table_name} - {table.capacity}</option>);
    }

    const errorsMessage = () => {
        return errors.map((error, index) =>  <ErrorAlert key={index} error={error} /> )
    }

    return (
        <form className="form-select">
                {errorsMessage()}
                <ErrorAlert error={apiError} />
                <ErrorAlert error={reservationsError} />

                <label className="form-label" hmtlFor="table_id">Choose Table:</label>
                <select
                        className="form-control"
                        name="table_id"
                        id="table_id"
                        value={table_id}
                        onChange={handleChange}
                >
                        <option value={0}>Choose a table</option>
                        {tableOptions()}
                </select>

                <button className="btn btn-primary" type="Submit" onClick={handleSubmit}>Submit</button>
                <button className="btn btn-danger" type="button" onClick={history.goBack}>Cancel</button>
        </form>
    );
}