import React, { useEffect, useState} from "react";
import { useHistory, useParams} from "react-router-dom";
import { makeReservations, listReservations, editReservationInfo } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";


export default function ReservationsForm( { loadDashboard, edit } ) {

    
    const history = useHistory();
    const { reservation_id } = useParams();

    //States
    const [errors, setErrors] = ([]);
    const [reservationsError, setReservationsError] = useState(null);
    const [apiError, setApiError] = useState(null);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
    });

    //API Call
    useEffect(() => {

        async function loadReservations() {
            const abortController = new AbortController();
            return await listReservations(null, abortController.signal)
                    .catch(setReservationsError);
        }

        const editFields = (foundReservation) => {
            if (!foundReservation || foundReservation.status !== "booked") {
                return <p>Only booked reservations can be edited.</p>
            }
            const date = new Date(foundReservation.reservation_date);
            const dateString = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + (date.getData())).slice(-2)}`;
            setFormData({
                first_name: foundReservation.first_name,
                last_name: foundReservation.last_name,
                mobile_number: foundReservation.mobile_number,
                reservation_date: dateString,
                reservation_time: foundReservation.reservation_time,
                people: foundReservation.people,
            });
        }

        if (edit) {
            if (!reservation_id) return null;
            loadReservations()
                    .then((response) => response.find((reservation) => reservation.reservation_id === Number(reservation_id)))
                    .then(editFields)
        }

    }, [edit, reservation_id]);

    
    //Handle functions
    const handleChange = ({ event }) => {
        setFormData({...formData, [event.name]: event.name === "people" ? Number(event.value) : event.value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const abortController = new AbortController();

        const foundErrors = [];
        if (checkDate(foundErrors) && checkFields(foundErrors)) {
            if (edit) {
                editReservationInfo(reservation_id, formData, abortController.signal)
                        .then(loadDashboard)
                        .then(() => history.push(`/dashboard?date={formData.resevation_date}`))
                        .catch(setApiError);
            }
            else {
                makeReservations(formData, abortController.signal)
                        .then(loadDashboard)
                        .then(() => history.push(`/dashboard?date={formData.resevation_date}`))
                        .catch(setApiError);
            }
        }

        setErrors(foundErrors);

        return () => abortController.abort();
    }

    //Validation
    const checkDate = (foundErrors) => {

        const reservationDate = new Date(`${formData.reservation_date}T${formData.reservation_time}:00.000`);
        const currentDate = new Date();

            if (reservationDate.getDay === 2) {
                foundErrors.push({ message: "Reservations cannot be made on a Tuesday."})
            }

            if (reservationDate < currentDate) {
                foundErrors.push({ message: "Reservations must be made at a later time"})
            }

            if ( reservationDate.getHours() < 10 || (reservationDate.getHours() === 10 && reservationDate.getMinutes() < 30) ) {
                foundErrors.push({ message: "Reservations cannot be made before 10:30am." })
            }

            else if (reservationDate.getHours() > 22 || (reservationDate.getHours() === 22 && reservationDate.getMinutes() >= 30) ) {
                foundErrors.push({ message: "Reservations cannot be made after closing."})
            }

            else if (reservationDate.getHours() > 21 || (reservationDate.getHours() === 21 && reservationDate.getMinutes() > 30) ) {
                foundErrors.push({ message: "Reservations must be made at least an hour before closing."})
            }
        return foundErrors.length === 0;

    }

    const checkFields = (foundErrors) => {
        for (const field in formData) {
            if (formData[field] === "") {
                    foundErrors.push({ message: `${field.split("_").join(" ")} cannot be left blank.`})
            }
        }

        return foundErrors.length === 0;
    }


    const errorsWarning = () => {

        return errors.map((error, index) => <ErrorAlert error={error} />);

    }


    return (
        <form>

            {errorsWarning}
            <ErrorAlert error={apiError} />
            <ErrorAlert error={reservationsError} />

            <label className="form-label" htmlFor="first_name">First Name:&nbsp;</label>
                <input
                    className="form-control"
                    name="first_name"
                    id="first_name"
                    type="text"
                    onChange={handleChange}
                    value={formData.first_name}
                    required
                />
        
            <label className="form-label" htmlFor="last_name">Last Name:&nbsp;</label>
                <input
                    className="form-control"
                    name="last_name"
                    id="last_name"
                    type="text"
                    onChange={handleChange}
                    value={formData.last_name}
                    required
                />

            <label className="form-label" htmlFor="mobile_number">Mobile Number:&nbsp;</label>
                <input
                    className="form-control"
                    name="mobile_number"
                    id="mobile_number"
                    type="text" 
                    onChange={handleChange}
                    value={formData.mobile_number}
                    required
                />

            <label className="form-label" htmlFor="reservation_date">Reservation Date:&nbsp;</label>
                <input
                    className="form-control"
                    name="reservation_date"
                    id="reservation_date"
                    type="date"
                    onChange={handleChange}
                    value={formData.reservation_date}
                    required
                />
            
            <label className="form-label" htmlFor="reservation_time">Reservation Time:&nbsp;</label>
                <input
                    className="form-control"
                    name="reservation_time"
                    id="reservation_time"
                    type="time"
                    onChange={handleChange}
                    value={formData.reservation_time}
                    required
                />
            
            <label className="form-label" htmlFor="people">Party Size:&nbsp;</label>
                <input
                    className="form-control"
                    name="people"
                    id="people"
                    type="number"
                    min="1"
                    onChange={handleChange}
                    value={formData.people}
                    required
                />

            <button className="btn btn-primary m-1" type="submit" onClick={handleSubmit}>Submit</button>
            <button className="btn btn-danger m-1" type="button" onClick={history.go(-1)}>Cancel</button>

        </form>
    ); 
}