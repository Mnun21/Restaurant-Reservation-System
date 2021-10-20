import React from "react";
import { updateReservationStatus } from "../utils/api";

export default function ReservationComponent ({ loadDashboard, reservation }) {

    if (!reservation || reservation.status === "finished") return null;

    const cancelMessage = () => {

        if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
            
            const abortController = new AbortController();

            updateReservationStatus(reservation.reservation_id, "cancelled", abortController.status)
                .then(loadDashboard)

        return () => abortController.abort();
        }
    }

    return (
        <tr>
            <th scope="row">{reservation.reservation_id}</th>
            
            <td>{reservation.first_name}</td>
            <td>{reservation.last_name}</td>
            <td>{reservation.mobile_number}</td>
            <td>{reservation.reservation_date.substr(0, 10)}</td>
            <td>{reservation.reservation_time.substr(0, 5)}</td>
            <td>{reservation.people}</td>
            
            <td data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>

            {reservation.status === "booked" &&
            <>
            <td>
                <a href={`/reservations/${reservation.reservation_id}/seat`}>
                    <button className="btn btn-outline-dark" type="button">Seat</button>
                </a>
            </td>
            <td>
                <a href={`/reservations/${reservation.reservation_id}/edit`}>
                    <button className="btn btn-secondary" type="button">Edit</button>
                </a>
            </td>
            <td>
                <button className="btn btn-danger" type="button" onClick={cancelMessage} data-reservation-id-cancel={reservation.reservation_id}>
                   Cancel
                </button>
            </td>
            </>
            }

        </tr>       
    )
}