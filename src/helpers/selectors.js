export function getAppointmentsForDay(state, day) {
  //... returns an array of appointments for that day
  const days = state.days;
  const appointments = state.appointments;
  const results = []

  //iterate through days to search for match with day
  for (const el of days) {
    if (el.name === day) {
      //iterate through days.appointment (interview number)
      //push corresponding appointment number from appointments object
      el.appointments.forEach((itvNum) => results.push(appointments[itvNum]))
    }
  }

  return results;
}