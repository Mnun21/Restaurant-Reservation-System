import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time";
import ReservationComponent from "./ReservationComponent";
import TableComponent from "./TableComponent";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, reservations, reservationsError, tables, tableError}) {
  
  const history = useHistory();

  const reservationsInfo = () => { return tables.map((table) => <ReservationComponent key={table.table_id} table={table} /> )};

  const tablesInfo = () => { return tables.map((table) => <TableComponent key={table.table_id} table={table} /> )};


  return (
    <main>

          <h1>Dashboard</h1>
         
          <h4 className="mb-0">Reservations for {date}</h4>

          <ErrorAlert error={reservationsError} />

          <table class="table">
                 <thead>
                          <tr>
                                <th scope="col">ID</th>
                                <th scope="col">First Name</th>
                                <th scope="col">Last Name</th>
                                <th scope="col">Mobile Number</th>
                                <th scope="col">Time</th>
                                <th scope="col">People</th>
                                <th scope="col">Status</th>
                                <th scope="col">Edit</th>
                                <th scope="col">Cancel</th>
                                <th scope="col">Seat Table</th>
                          </tr>
                 </thead>

                 <tbody>
                        {reservationsInfo()}
                 </tbody>

                 <tbody>
                        {tablesInfo()}
                 </tbody>

        </table>
      


    

      <button type="button" onClick={() => history.push(`/dashboard?date=${previous(date)}`)}>Previous Day</button>
      <button type="button" onClick={() => history.push(`/dashboard?date=${today()}`)}>Today</button>
      <button type="butoon" onClick={() => history.push(`/dashboard?date=${next(date)}`)}>Next Day</button>

    </main>
    
  );
}

export default Dashboard;
