import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  // declare combinated useState
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    inverviewers: {}
  })

  // click handler for setting day
  const setDay = day => setState({...state, day});

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


    // delete interview and set state
    return (
      axios.delete(`/api/appointments/${id}`)
        .then(() => {
          appointments[id].interview = null;          
          setState({...state, appointments});
        })
    )
  }

  return { state, setDay, bookInterview, deleteInterview }
}