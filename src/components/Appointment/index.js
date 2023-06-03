import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Status from "components/Appointment/Status";
import useVisualMode from "hooks/useVisualMode";
import Form from "components/Appointment/Form";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";

export default function Appointment(props) {
  // visual rendering for interface
  const SHOW = "SHOW";
  const EMPTY = "EMPTY";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const ERROR_SAVE = "ERROR_SAVE";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const DELETING = "DELETING";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  
  // function for saving interviews
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    
    // Set saving visual mode
    transition(SAVING);

    // PUT interview and set show visual mode
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(() => transition(ERROR_SAVE, true))
  };

  function onDelete() {
    transition(DELETING, true);
    
    // call delete Interview API function
    props.deleteInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(() => transition(ERROR_DELETE, true))
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
        onEdit={() => {transition(EDIT)}}
        onDelete={() => {transition(CONFIRM)}}
      />
    )}
    {mode === SAVING && (
      <Status message={"Saving"}/>
    )}
    {mode === ERROR_SAVE && (
      <Error 
        message={"Could not save appointment"}
        onClose={() => {back()}}
      />
    )}
    {mode === CONFIRM && (
      <Confirm 
        message={'Are you sure you would like to delete?'}
        onCancel={() => {back()}}
        onConfirm={onDelete}
      />
    )}
    {mode === EDIT && (
      <Form 
        student={props.interview.student}
        interviewer={props.interview.interviewer.id}
        interviewers={props.interviewers}
        onCancel={() => {back()}}
        onSave={save}
      />
    )}
    {mode === DELETING && (
      <Status message={"Deleting"}/>
    )}
    {mode === ERROR_DELETE && (
      <Error 
        message={"Could not cancel appointment"}
        onClose={() => {back()}}
      />
    )}
  </article>
}
