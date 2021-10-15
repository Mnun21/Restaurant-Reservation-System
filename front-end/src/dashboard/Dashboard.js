import React from "react";
import { useHistory } from "react-router";
import { previous, today, next } from "../utils/date-time";
import ReservationComponent from "./ReservationComponent";
import TableComponent from "./TableComponent";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, loadDashboard, reservations, reservationsError, tables, tableError}) {
  
  const history = useHistory();

  const reservationsInfo = () => { return reservations.map((reservation) => <ReservationComponent key={reservation.reservation_id} reservation={reservation} loadDashboard={loadDashboard} /> )};

  const tablesInfo = () => { return tables.map((table) => <TableComponent key={table.table_id} table={table} loadDashboard={loadDashboard} /> )};


  return (
    <main>

        <h1>Dashboard</h1>
         
        <h4 className="display-4">Reservations for {date}</h4>

        <ErrorAlert error={reservationsError} />

        <table className="table table-hover">
                 <thead className="thead-dark">
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
                              <th scope="col">Seat Guests</th>
                          </tr>
                 </thead>

                 <tbody>
                    {reservationsInfo()}
                 </tbody>
        </table>

      <br />
      <br />

        <h4 className="display-4">Tables</h4>

        <ErrorAlert error={tableError} />

        <table className="table table-hover">
                 <thead className="thead-dark">
                          <tr>
                              <th scope="col">Table ID</th>
                              <th scope="col">Table Name</th>
                              <th scope="col">Capacity</th>
                              <th scope="col">Status</th>
                              <th scope="col">Reservartion ID</th>
                              <th scope="col">Finish Table</th>
                          </tr>
                  </thead>

                  <tbody>
                      {tablesInfo()}
                  </tbody>

        </table>

      <button className="btn btn-secondary m-1" type="button" name="previous" onClick={() => history.push(`/dashboard?date=${previous(date)}`)}>Previous Day</button>
      <button className="btn btn-primary m-1" type="button" onClick={() => history.push(`/dashboard?date=${today()}`)}>Today</button>
      <button className="btn btn-secondary m-1" type="button" onClick={() => history.push(`/dashboard?date=${next(date)}`)}>Next Day</button>

    </main>
    
  );
}

export default Dashboard;
