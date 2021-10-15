import React from "react";
import { finishTable } from "../utils/api";

export default function TableComponent ({ loadDashboard, table }) {

  if(!table) return null;

  const handleFinish = () => {
            if (window.confirm("Continue only if the table is ready to seat new guests")) {
                const abortController = new AbortController();

                finishTable(table.table_id, abortController.signal)
                        .then(loadDashboard);
                
                return () => abortController.abort();
            }
    }

  return (
            <tr>
                <th scope="row">{table.table_id}</th>
                <td>{table.table_name}</td>
                <td>{table.capacity}</td>
                <td data-table-id-status={table.table_id}>{table.status}</td>
                <td>{table.reservation_id ? table.reservation_id : ""}</td>

                {table.status === "occupied" &&
                    <td>
                        <button data-table-id-finish={table.table_id} onClick={handleFinish} type="button">Finish</button>
                    </td>
                }
            </tr>
    );
}