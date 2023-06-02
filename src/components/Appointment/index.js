import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import useVisualMode from "hooks/useVisualMode";
import Form from "components/Appointment/Form";

export default function Appointment(props) {
  // visual rendering for interface
  const SHOW = "SHOW";
  const EMPTY = "EMPTY";
  const CREATE = "CREATE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  
  // function for saving interviews
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    //pass new interview object
    props.bookInterview(props.id, interview)
    //set visual mode to show 
    transition(SHOW)
  }
  
  return <article className="appointment">
    <Header time={props.time} />
    {mode === EMPTY && (
      <Empty 
        onAdd={() => {transition(CREATE)}} 
      />
    )}
    {mode === CREATE && (
      <Form 
        interviewers={props.interviewers}
        onCancel={() => {back()}}
        onSave={save}
      />
    )}
    {mode === SHOW && (
      <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
      />
    )}
  </article>
}
