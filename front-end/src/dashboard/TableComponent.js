import React from "react";
import { useHistory } from "react-router-dom";

export default function TableComponent ({ table, handleFinish }) {

    const history = useHistory();

    if (!table) return null;

    function handleFinish () {
            if (window.confirm("Continue only if the table is ready")) {
                    history.push("/dashboard")
            }
    }

    return (
            <tr>
                    <th scope="row">{table.table_id}</th>
                    <td>{table.table_name}</td>
                    <td>{table.capacity}</td>
                    <td data-table-id-status={table.table_id}>{table.status}</td>

                    {table.status === "occupied" &&
                                <td data-table-id-finish={table.table_id}>
                                        <button onClick={handleFinish} type="button">Finish</button>
                                </td>
                    }
            </tr>
    );
}