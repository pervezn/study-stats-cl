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
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from 'react-bootstrap/Dropdown';
import CurrentClasses from "./CurrentClasses.js"

const week = 1;

const Nav = () => (
  <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="#home">Study Stats</Navbar.Brand>
  </Navbar>
);

const AddClasses = ({classes, allClasses}) => {
  // when you add a class, the new class list include all previous classes
  // plus the one submitted
  const handleSubmit = (classes, allClasses) => {
    let newClasses = [];
    for (let i = 0; i < classes.classes.length; i += 1) {
        newClasses.push(classes.classes[i])
    }
    for (let i = 0; i < allClasses.allClasses.length; i += 1) {
        if (allClasses.allClasses[i].title == "Data Structures") {
          newClasses.push(allClasses.allClasses[i])
        }
    }
    classes.setClasses(newClasses);
  };
  // when assignment button is clicked, bring up modal and track which class/assignment it is
    return (
      <DropdownButton  className="dropdownButton" title="Add Another Class">
        <Dropdown.Item className="addClassItem btn-primary" onClick={() => handleSubmit(classes, allClasses)}>Data Structures</Dropdown.Item>
      </DropdownButton>
    )
};

// given an assignment JSON, outputs median time for that assignment
const median_time = assignment => {
  const times = assignment.responses.map(response => response.time)
                .sort((a, b) => a - b);
  const mid = _.floor(times.length / 2);
  return _.isEqual(times.length%2, 0) ? _.mean([times[mid-1], times[mid]]) : times[mid];
}

const Recommendations = ({state}) => {
  // the recommendation is to work on the assignment that takes the most time
  let maxHours = 0;
  let cardText = "";
  if (state.classes[0].assignments.length === 0) {
    cardText = "Congrats! You have no more assignments."
  }
  for (let i = 0; i < state.classes.length; i += 1) {
    for (let j = 0; j < state.classes[i].assignments.length; j += 1) {
      let median_time_spent = median_time(state.classes[i].assignments[j]);
      if (median_time_spent > maxHours) {
        maxHours = median_time_spent;
        cardText = "Past students have spent " + median_time_spent + " hours on " + state.classes[i].title + " - " + state.classes[i].assignments[j].title + ". We recommend you start this one first!";
      }
    }
  }
  return (
    <Col>
      <Card border="light">
        <Card.Body>
          <Card.Title><h3>Recommendation</h3></Card.Title>
          <Card.Text>{cardText}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  )
};

const getBarData = (data, state) => {
  let dueSoon = "";
  let maxHours = 0;
  const options = {
    title: "This Week's Assignments",
    legend: {position: 'none'},
    vAxis: {
      title: "Median Hours",
      titleTextStyle: {
        italic: false
      }
    }
  };
  for (let i = 0; i < state.classes.length; i += 1) {
    const assignments = state.classes[i].assignments;
    for (let j = 0; j < assignments.length; j += 1) {
      const assignment = assignments[j];
      const median_time_spent = median_time(assignment);
      if (_.isEqual(assignment.week, week)) {
        if (median_time_spent > maxHours){
          maxHours = median_time_spent;
          dueSoon = state.classes[i].title + " " + assignment.title;
        }
        data.push([state.classes[i].title + " " + assignment.title, median_time_spent, ''])
      }
    }
  }
  for (let i = 0; i < data.length; i += 1){
    if (_.isEqual(data[i][0], dueSoon)) {
      data[i][2] = 'purple';
    }
  }
  return [data, options];
}

const getScatterData = (data, state) => {
  let dueSoon = "";
  let maxHours = 0;
  let ticks = [];
  let count = 0;
  for (let i = 0; i < state.classes.length; i += 1) {
    let assignment;
    const assignments = state.classes[i].assignments;
    for (let j = 0; j < assignments.length; j += 1) {
      let responses = [];
      assignment = assignments[j];

      for(let k = 0; k < assignment.responses.length; k++){
        let response = assignment.responses[k];
        data.push([{v: count, f: (state.classes[i].title + " " + assignment.title)}, response.time,  '<h6>Comment: </h6>' + response.comment + '<h6>Hours Spent: </h6>' + response.time, ''])
      }
      ticks.push({v: count, f:(state.classes[i].title + " " + assignment.title)})
      count++;
    }
  }
  const options = {
    tooltip: {isHtml: true},
    title: "This Week's Assignments",
    legend: {position: 'none'},
    hAxis: {ticks : ticks },
    vAxis: {
      title: "Hours Spent",
      titleTextStyle: {
        italic: false
      }
    }
  };
  console.log("DATA IS: ", data)
  return [data, options];
}

const Graph = ({state}) => {
  const [useBar, setBar] = useState(true);

  let data = [];
  let touple = [];
  let options = {};

  if (useBar) {
    data = [
      ['Assignment', 'Median Hours Spent', { role: 'style' }],
    ];
    touple = getBarData(data, state);
    data = touple[0]
    options = touple[1]
  }
  else {
    data = [
      ['Assignment', 'Hours Spent', {role: 'tooltip', type: 'string', p: { html: true }}, {role: 'style'}],
    ];
    touple = getScatterData(data, state);
    data = touple[0]
    options = touple[1]
  }

  return (
    <Col>
      <Card border="light">
        <Card.Body>
          <Card.Title><h3>Upcoming Week</h3></Card.Title>
          <DropdownButton className="dropdownButton" title="Select Chart Type">
            <Dropdown.Item onClick={() => setBar(true)}>Median Times</Dropdown.Item>
            <Dropdown.Item onClick={() => setBar(false)}>Individual Times</Dropdown.Item>
          </DropdownButton>
          <div className={"my-pretty-chart-container"}>
            {useBar ?
            <Chart
              chartType="ColumnChart"
              data={data}
              options={options}
              width="100%"
              height="300px"
              legendToggle
            /> :
            <Chart
              chartType="ScatterChart"
              data={data}
              options={options}
              width="100%"
              height="300px"
              legendToggle/>}
          </div>
        </Card.Body>
      </Card>
    </Col>
  )
};

function App() {
  // list of classes with assignments you have yet to complete
  const [classes, setClasses] = useState([{id: "", title: "", assignments: []}])
  const [allClasses, setAllClasses] = useState([{id: "", title: "", assignments: []}])
  const url = '/data/assignments.json';

  useEffect(() => {
    const fetchClasses= async () => {
      const response = await fetch(url);
      if (!response.ok) throw response;
      const json = await response.json();
      setAllClasses(json.courses);
      let userCourses = json.users[0].courses;
      setClasses(json.courses.filter(course => userCourses.includes(course.id)));
    }
    fetchClasses();
  }, [])

  return (
    <React.Fragment>
      <Nav/>
      <Container>
      <Row>
          <CurrentClasses key={classes.title} classes={{classes, setClasses}} allClasses={{allClasses, setAllClasses}}/>
          <Graph key={classes.title} state={{classes, setClasses}}/>
        </Row>
        <Row>
          <Recommendations state={{classes, setClasses}}/>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default App;