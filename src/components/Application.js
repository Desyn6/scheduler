import React, { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

export default function Application(props) {
  // declare combinated useState
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    inverviewers: {}
  })

  // click handler for setting day
  const setDay = day => setState({...state, day});

  // write appointment for selected day
  const dailyAppointments = getAppointmentsForDay(state, state.day)

  // fetch days and appointment data from API
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(state => ({
        ...state, 
        days: all[0].data, 
        appointments: all[1].data,
        interviewers: all[2].data
      }))
    });
  }, []);

  async function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    }
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    // write interview to DB
    return (
      axios.put(`/api/appointments/${id}`, {interview})
        .then(setState({...state, appointments}))
    )
  };

  async function deleteInterview(id) {
    // set copy of appointments array
    const appointments = {
      ...state.
      appointments
    }
    // set interview of appointments copy to null
    appointments[id].interview = null;

    // delete interview and set state
    return (axios.delete(`/api/appointments/${id}`))
      .then(setState({...state, appointments}));
  }

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            value={state.day}
            onChange={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        { 
          dailyAppointments.map((appointment) => {
            const interview = getInterview(state, appointment.interview);
            const interviewers = getInterviewersForDay(state, state.day);

            return (
              <Appointment 
                key={appointment.id}
                id={appointment.id}
                time={appointment.time}
                interview={interview}
                interviewers={interviewers}
                bookInterview={bookInterview}
                deleteInterview={deleteInterview}
              />
            )
          })
        }
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
