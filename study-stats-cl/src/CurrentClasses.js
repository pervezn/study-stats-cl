import React, { useState , useEffect} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import ButtonGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import _ from 'lodash';
import { Chart } from "react-google-charts";

const CurrClasses = ({classes, allClasses}) => {
    // tracks whether assignment completion modal is shown or not
  
    const [showLog, setShowLog] = useState(false);
  
    // tracks the assignment that is clicked for completion
    // logItem = [currentClass, currentAssignment]
    const [logItem, setLogItem] = useState([{id: "", title: "", assignments: []}, {id: "", title: "", completed: "", responses: []}]);
  
    const handleClose = () => setShowLog(false);
  
    // when you submit an assignment, the new assignment list buttons include all previous assignments
    // minus the one submitted
    const handleSubmit = (currInfo) => {
      let newClasses = [];
      let i = 0;
      for (i; i < classes.classes.length; i += 1) {
        if (!_.isEqual(classes.classes[i], currInfo[0])) {
          newClasses.push(classes.classes[i])
        }
        else {
          let newAssignments = [];
          let j = 0;
          for (j; j < classes.classes[i].assignments.length; j += 1) {
            if (!_.isEqual(currInfo[1], classes.classes[i].assignments[j])) {
              newAssignments.push(classes.classes[i].assignments[j])
            }
          }
          newClasses.push({id: classes.classes[i].id, title: classes.classes[i].title, assignments: newAssignments});
        }
      }
      classes.setClasses(newClasses);
      setShowLog(false);
    }
  
    // when assignment button is clicked, bring up modal and track which class/assignment it is
    const handleShow = (currClass, currAssignment) => {
      setLogItem([currClass, currAssignment]);
      setShowLog(true);
    };
  
    return (
      <Col>
        <Card border="light">
          <Card.Body>
            <Card.Title><h3>Upcoming Assignments</h3></Card.Title>
            <Card.Text>
              <ButtonGroup variant="flush">
                {classes.classes.map(currClass =>
                  currClass.assignments.map(currAssignment =>
                  <React.Fragment key={currAssignment.title}>
                  <Button data-cy="class"
                  onClick={() => handleShow(currClass, currAssignment)}>{currClass.title} - {currAssignment.title}</Button>
                  <br />
                  </React.Fragment>
                ))}
              </ButtonGroup>
  
              <Modal show={showLog} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Enter hours spent to complete this assignment:</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                      <Form.Control as="textarea" rows="2" />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Header>
                  <Modal.Title>Enter any comments/feedback about this assignment:</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                      <Form.Control as="textarea" rows="2" />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button data-cy="submit" onClick={() => handleSubmit(logItem)} variant="success">
                    Submit
                  </Button>
                </Modal.Footer>
              </Modal>
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    );
  };

  export default CurrClasses;