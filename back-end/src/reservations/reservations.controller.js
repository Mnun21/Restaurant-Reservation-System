const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");

/**
 * List and create handler for reservations
 */

async function list(req, res) {

  const date = req.query.date;

  const response = await service.list(date);

  res.json({ data: response });

}

async function create(req, res) {

  //req.body.status = "booked"

  const response = await service.create(req.body.data);

  res.status(201).json({ data: response[0] });

}

///////// Validation /////////

function checkBody(req, res, next) {

    if (!req.body.data) {
      return next({ status:400, message: "Body must include a data object" });
   }

  const bodyRequirements = ["first_name", "last_name", "mobile_number", "resevation_date", "reservation_time", "people"];

  for (const of bodyRequirements) {

    if (!req.body.data.hasOwnProperty(field) || req.body.data[field] === "") {
      return next({ status: 400, message: `Field required: '${field}'` });
    }

    if (Number.NaN(Date.parse(`${req.body.data.reservation_date} ${req.body.data.reservation_time}`))) {
      return next({ status:400, message: "'reservation_date' or 'reservation_time' is an incorrect format" });
    }

    if (typeof req.body.data.people !== "number") {
      return next({ status:400, message: "'people' field must be a number" });
    }

    if (req.body.data.people < 1) {
      return next({ status:400, message: "'people' field must be at least 1" });
    }

    next();

  }
}

function checkDate(req, res, next) {

  const reservationDate = new Date(`${req.body.date.reservation_time}T${req.body.data.reservation_time}:00:000`);
  const currentDate = new Date();
  
  if (reservationDate.getDay() === 2) {
    return next({ status: 400, message: "'reservation_date' field cannot be set to Tuesday" });
  }

  if (reservationDate < currentDate) {
    return next({ status: 400, message: "'reservation_time' and 'reservation_date' field must be a valid time in the future" });
  }

  if (reservationDate.getHours() === 10 || (reservationDate.getHours() <= 10 && reservationDate.getMinutes() < 30) ) {
    return next({ status: 400, message: "'reservation_time' field: reservations cannot be set before the restaurant opens at 10:30am"})
  }

  if (reservationDate.getHours() > 21 || (reservationDate.getHours() === 21 && reservationDate.getMinutes() > 30)) {
    return next({ status: 400, message: "'reservation_time' field: reservations must be made at least an hour before closing time at 10:30pm" })
  }

  if (reservationDate.getHours() > 22 || (reservationDate.getHours() === 22 && reservationDate.getMinutes() >= 30)) {
    return next({ status: 400, message: "'reservation_time' field: reservations cannot be made after closing time at 10:30pm" })
  }

  next();

}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [checkBody, checkDate, asyncErrorBoundary(create)], 
};
