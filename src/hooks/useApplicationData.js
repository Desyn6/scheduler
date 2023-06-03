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

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    }

    // write interview to DB
    return (
      axios.put(`/api/appointments/${id}`, {interview})
        .then(() => {
          const appointments = {
            ...state.appointments,
            [id]: appointment
          };
          const days = writeSpotsToDays(appointments, id)   
          setState({
            ...state, 
            appointments,
            days
          })
        })
    )
  };

  function deleteInterview(id) {
    // set copy of appointments array
    const appointments = {
      ...state.appointments
    }

    // delete interview and set state
    return (
      axios.delete(`/api/appointments/${id}`)
        .then(() => {
          appointments[id].interview = null;  
          const days = writeSpotsToDays(appointments, id)    
          setState({
            ...state, 
            appointments, 
            days});
        })
    )
  }

  function writeSpotsToDays(appointments, id) {
    const days = [...state.days];
    let slots;
    let freeSpots = 0;
    let dayIndex;

    // find day slot ID numbers, and dayIndex in days array
    for (let i = 0; i < days.length; i++) {
      if (days[i].appointments.includes(id)) {
        slots = [...days[i].appointments]
        dayIndex = i;
        break;
      };
    }

    // Find number of free slots
    for (const slot of slots) {
      if (appointments[slot].interview === null) {freeSpots++}
    }

    // set free slots in day
    days[dayIndex].spots = freeSpots;

    return days
  }
  
  return { state, setDay, bookInterview, deleteInterview }
}