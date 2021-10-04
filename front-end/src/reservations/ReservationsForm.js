import React, { useEffect, useState} from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";


export default function ReservationsForm() {

    //Hooks
    const history = useHistory();

    //States
    const [errors, setErrors] = ([]);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        mobile_number: '',
        reservation_date: '',
        reservation_time: '',
        people: 0,
    });
    
    //Handle functions
    function handleChange({ event }) {
        setFormData({...formData, [event.name]: event.value });
    }

    function handleSubmit (event) {
        event.preventDefault();

            if ( checkDate() ) {
                history.push(`/dashboard?date={formData.resevation_date}`);
            }
    }

    //Validation
    function checkDate() {

        const reservationDate = new Date(`${formData.reservation_date}T${formData.reservation_time}:00.000`);
        const currentDate = new Date();

        const errorMessages = [];

            if (reservationDate.getDay === 2) {
                errorMessages.push({ message: "Reservations cannot be made on a Tuesday."})
            }

            if (reservationDate < currentDate) {
                errorMessages.push({ message: "Reservations must be made at a later time"})
            }

            if ( reservationDate.getHours() < 10 || (reservationDate.getHours() === 10 && reservationDate.getMinutes() < 30) ) {
                errorMessages.push({ message: "Reservations cannot be made before 10:30am." })
            }

            else if ( reservationDate.getHours() > 22 || (reservationDate.getHours() === 22 && reservationDate.getMinutes() >= 30) ) {
                errorMessages.push({ message: "Reservations cannot be made after closing."})
            }

            else if ( reservationDate.getHours() > 21 || (reservationDate.getHours() === 21 && reservationDate.getMinutes() > 30) ) {
                errorMessages.push({ message: "Reservations must be made at least an hour before closing."})
            }


        setErrors(errorMessages);

            if (errorMessages.length > 0 ) {
                return false;
            }

        return true;

    }


    const errorsWarning = () => {

        return errors.map((error, index) => <ErrorAlert key={index} error={error} />);

    }
        //{errorsWarning()}

    return (
        <form>
            
            

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
                    onChange={handleChange}
                    value={formData.people}
                />

            <button className="btn btn-primary m-1" type="submit" onClick={handleSubmit}>Submit</button>
            <button className="btn btn-danger m-1" type="button" onClick={history.go(-1)}>Cancel</button>

        </form>
    ); 
}