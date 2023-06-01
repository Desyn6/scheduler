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

export function getInterview(state, interview) {
  if (!interview) return null;

  // ensure interview obj is not mutated by returning new data
  return {
    student: interview.student,
    interviewer: state.interviewers[interview.interviewer]
  }  
}

export function getInterviewersForDay(state, day) {
  //... returns an array of appointments for that day
  const days = state.days;
  const appointments = state.appointments;
  const interviewers = state.interviewers;
  const results = [];

  //iterate through days to search for match with day
  for (const el of days) {
    if (el.name === day) {
      //iterate through days.appointment (interview number)
      //push corresponding appointment number from appointments object
      el.interviewers.forEach((itvNum) => results.push(interviewers[itvNum]))
    }
  }
  console.log(results)
  return results;
}
