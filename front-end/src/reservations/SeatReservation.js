import React, { useState }from "react";
import { useHistory } from "react-router";
import { seatTable } from "../utils/api";



export default function SeatReservation ({ reservations, tables }) {

    const history = useHistory();

    const [tableId, setTableId] = useState(0);
    const [errors, setErrors] = useState([]);

    if (!tables || !reservations) return null;

    function handleChange ({ target }) {
        setTableId(target.value);
    }

    function handleSubmit (event) {
        event.preventDefault();
        const abortController = new AbortController();

        if(checkSeat()) {
            SeatReservation(reservation_id, table_id, abortController.signal)
                            .then(loadDashboard)
                            .then(() => history.push(`/dashboard`))
                            .catch(setApiError);

        }

        return () => abortController.abort();
    }

    function checkSeat () {
        const foundErrors = [];

        const foundTable = tables.find((table) => table.table_id === tableId);
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

        if (foundErrors.length > 0) {
            return false;
        }

        return true;

    }

    const tableOptions = () => {
        return tables.map((table) => <option value={table.table_id}>{table.table_name} - {table.capacity}</option>);
    }

    return (
        <form>
                <label hmtlFor="table_id">Choose Table:</label>
                <select
                        name="table_id"
                        id="table_id"
                        value={tableId}
                        onChange={handleChange}
                >
                        {tableOptions()}
                </select>

                <button type="Submit" onClick={handleSubmit}>Submit</button>
                <button type="button" onClick={history.goBack}>Cancel</button>
        </form>
    );
}