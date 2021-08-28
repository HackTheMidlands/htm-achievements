// import logo from './logo.svg';
import './App.css';
import 'bulma/css/bulma.min.css';
import * as AuthProvider from "./providers/AuthProvider";
import { Achievement, AchieveHolder } from "./components/section";
import React, { useState, useEffect } from 'react';


import logo from "./resources/discord.png";
import cpu from "./resources/cpu.png";
import programming from "./resources/programming.png";

function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [achievements, setAchievements] = useState([]);

  // On component mount: Check if user logged in, if so load their achievements
  useEffect(() => {
    AuthProvider.checkAuth().then(log_in_status => {
      setLoggedIn(log_in_status);
      if (log_in_status) {
        AuthProvider.getAchievements().then(achieve => { 
          console.log(achieve.data)
          setAchievements(achieve.data);
        })
      }
    })

  }, []);
  if (loggedIn) {
    return (
      <div className="App">
        <div className="header">
          <img
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMzY0Ljk5OSIgaGVpZ2h0PSIxNTUiIHZpZXdCb3g9IjAgMCAxMzY0Ljk5OSAxNTUiPgogICAgPHBhdGggaWQ9IkludGVyc2VjdGlvbl8xIiBkYXRhLW5hbWU9IkludGVyc2VjdGlvbiAxIgogICAgICAgICAgZD0iTTAsMTU1VjBIMTM2NVYxNS4xMTRjLTIuMzI4LDEuMzU3LTEyLjU3NCw3LjIzMi0yOS4wNjIsMTUuMzQtMTEuMDc3LDUuNDQ3LTIyLjc5MiwxMC44MzktMzQuODE5LDE2LjAyNS0xNS4wMzQsNi40ODMtMzAuNjA1LDEyLjY2My00Ni4yODEsMTguMzY5YTg1OS40MTgsODU5LjQxOCwwLDAsMS0xMjEuMjYsMzQuMzk0Yy0yNC4wODMsNC45MjctNDguMzUyLDguNzQtNzIuMTMzLDExLjMzNGE3MjEuNTM0LDcyMS41MzQsMCwwLDEtNzcuOTA3LDQuM2MtMTAxLjMxMSwwLTE3OC45NTQtMTQuMjc4LTI2MS4xNTUtMjkuMzkzbC0uMDE0LDBDNjc2LjU4LDc3LjA1OCw2MjkuMjMzLDY4LjM1Miw1NzUuNTM4LDYxLjdjLTI5LjAxLTMuNTk1LTU3LjEyOC02LjI2NC04NS45NTktOC4xNTktMTUuNjctMS4wMy0zMS43MjktMS44MzMtNDcuNzMxLTIuMzg4LTE2LjgyNy0uNTgxLTM0LjE1OS0uOTA4LTUxLjUxMi0uOTY4LTEuMjM3LDAtMi40NDYtLjAwNi0zLjYtLjAwNi0zMi4wMTQsMC02My41NDksMS41MjgtOTMuNzI4LDQuNTQzQTgwOS4zOTMsODA5LjM5MywwLDAsMCwyMTIuOTYxLDY2LjdjLTQzLjI1NSw4Ljc2OS04My44MDYsMjEtMTIwLjUyOCwzNi4zNDUtMTQuNDI1LDYuMDI4LTI4LjI4OCwxMi41NTktNDEuMiwxOS40MS0xMC4zMzQsNS40ODMtMjAuMDg0LDExLjE4LTI4Ljk4MSwxNi45MzNBMjI4Ljk2NCwyMjguOTY0LDAsMCwwLC41NjUsMTU1WiIKICAgICAgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzNjQuOTk5IDE1NSkgcm90YXRlKDE4MCkiIGZpbGw9IiNlZmY2ZmYiLz4KPC9zdmc+Cg=="
            className="wave" alt="Wave at bottom"></img>
          <div className="logout" onClick={AuthProvider.logout}>Logout</div>
          <div className="heading_head">
            <h3 className="head">HackTheMidlands 6.0</h3>
            <h1 className="head">Achievements</h1>
            <p className="head">Track your progress throughout the hackathon. The more you learn the more you earn.</p>
          </div>
          {/* <img src="htm.png" className="logo"> */}
        </div>
        <div className="achieve_grid">
          <AchieveHolder
            name={"Getting Started"}
          >
            <Achievement icon={logo} name={"The First Step"}  active={(achievements.some(e => e.name === 'The First Step'))?true:false}></Achievement>
            <Achievement icon={cpu} name={"CPU"} active={(achievements.some(e => e.name === 'CPU'))?true:false}></Achievement>
            <Achievement icon={programming} name={"Plug In"} active={(achievements.some(e => e.name === 'Plug In'))?true:false}></Achievement>

          </AchieveHolder>




        </div>
      </div>
    );






  } else {
    return (
      <div className="App">
        <div className="header">
          <img
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMzY0Ljk5OSIgaGVpZ2h0PSIxNTUiIHZpZXdCb3g9IjAgMCAxMzY0Ljk5OSAxNTUiPgogICAgPHBhdGggaWQ9IkludGVyc2VjdGlvbl8xIiBkYXRhLW5hbWU9IkludGVyc2VjdGlvbiAxIgogICAgICAgICAgZD0iTTAsMTU1VjBIMTM2NVYxNS4xMTRjLTIuMzI4LDEuMzU3LTEyLjU3NCw3LjIzMi0yOS4wNjIsMTUuMzQtMTEuMDc3LDUuNDQ3LTIyLjc5MiwxMC44MzktMzQuODE5LDE2LjAyNS0xNS4wMzQsNi40ODMtMzAuNjA1LDEyLjY2My00Ni4yODEsMTguMzY5YTg1OS40MTgsODU5LjQxOCwwLDAsMS0xMjEuMjYsMzQuMzk0Yy0yNC4wODMsNC45MjctNDguMzUyLDguNzQtNzIuMTMzLDExLjMzNGE3MjEuNTM0LDcyMS41MzQsMCwwLDEtNzcuOTA3LDQuM2MtMTAxLjMxMSwwLTE3OC45NTQtMTQuMjc4LTI2MS4xNTUtMjkuMzkzbC0uMDE0LDBDNjc2LjU4LDc3LjA1OCw2MjkuMjMzLDY4LjM1Miw1NzUuNTM4LDYxLjdjLTI5LjAxLTMuNTk1LTU3LjEyOC02LjI2NC04NS45NTktOC4xNTktMTUuNjctMS4wMy0zMS43MjktMS44MzMtNDcuNzMxLTIuMzg4LTE2LjgyNy0uNTgxLTM0LjE1OS0uOTA4LTUxLjUxMi0uOTY4LTEuMjM3LDAtMi40NDYtLjAwNi0zLjYtLjAwNi0zMi4wMTQsMC02My41NDksMS41MjgtOTMuNzI4LDQuNTQzQTgwOS4zOTMsODA5LjM5MywwLDAsMCwyMTIuOTYxLDY2LjdjLTQzLjI1NSw4Ljc2OS04My44MDYsMjEtMTIwLjUyOCwzNi4zNDUtMTQuNDI1LDYuMDI4LTI4LjI4OCwxMi41NTktNDEuMiwxOS40MS0xMC4zMzQsNS40ODMtMjAuMDg0LDExLjE4LTI4Ljk4MSwxNi45MzNBMjI4Ljk2NCwyMjguOTY0LDAsMCwwLC41NjUsMTU1WiIKICAgICAgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzNjQuOTk5IDE1NSkgcm90YXRlKDE4MCkiIGZpbGw9IiNlZmY2ZmYiLz4KPC9zdmc+Cg=="
            className="wave" alt="Wave at bottom"></img>

          <div className="heading_head">
            <h3 className="head">HackTheMidlands 6.0</h3>
            <h1 className="head">Achievements</h1>
            <p className="head">Track your progress throughout the hackathon. The more you learn the more you earn.</p>
          </div>
          {/* <img src="htm.png" className="logo"> */}
        </div>
        <div className="achieve_grid">

          <div onClick={AuthProvider.login}>Log In with Discord</div>



        </div>
      </div>
    );
  }
}

export default App;
