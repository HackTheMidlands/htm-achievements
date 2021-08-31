// import logo from './logo.svg';
import './App.css';
import 'bulma/css/bulma.min.css';
import * as AuthProvider from "./providers/AuthProvider";
import { Achievement, AchieveHolder } from "./components/section";
import React, { useState, useEffect, Fragment } from 'react';
import { FontAwesomeIcon } from  '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import {faDiscord} from '@fortawesome/free-brands-svg-icons'

// import ReactDOM from 'react-dom'


import logo from "./resources/discord.png";
import cpu from "./resources/cpu.png";
import programming from "./resources/programming.png";
import flag from "./resources/flag.png";
import tweet from "./resources/tweet.png";
import map from "./resources/map.png";
import signboard from "./resources/signboard.png";
import workshop from "./resources/workshop.png";

function App() {

  const [user, setLoggedIn] = useState(false);
  const [achievements, setAchievements] = useState([]);

  // On component mount: Check if user logged in, if so load their achievements
  useEffect(() => {
    AuthProvider.checkAuth().then(user_ => {
      setLoggedIn(user_.data);
      if (user_.data != false && user_.data != null) {
        AuthProvider.getAchievements().then(achieve => {
          setAchievements(achieve.data);
        })
      }
    })

  }, []);
  console.log(user)
  if (user != false && user != null) {
    return (
      <div className="App">
        <div className="header">
          <img
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMzY0Ljk5OSIgaGVpZ2h0PSIxNTUiIHZpZXdCb3g9IjAgMCAxMzY0Ljk5OSAxNTUiPgogICAgPHBhdGggaWQ9IkludGVyc2VjdGlvbl8xIiBkYXRhLW5hbWU9IkludGVyc2VjdGlvbiAxIgogICAgICAgICAgZD0iTTAsMTU1VjBIMTM2NVYxNS4xMTRjLTIuMzI4LDEuMzU3LTEyLjU3NCw3LjIzMi0yOS4wNjIsMTUuMzQtMTEuMDc3LDUuNDQ3LTIyLjc5MiwxMC44MzktMzQuODE5LDE2LjAyNS0xNS4wMzQsNi40ODMtMzAuNjA1LDEyLjY2My00Ni4yODEsMTguMzY5YTg1OS40MTgsODU5LjQxOCwwLDAsMS0xMjEuMjYsMzQuMzk0Yy0yNC4wODMsNC45MjctNDguMzUyLDguNzQtNzIuMTMzLDExLjMzNGE3MjEuNTM0LDcyMS41MzQsMCwwLDEtNzcuOTA3LDQuM2MtMTAxLjMxMSwwLTE3OC45NTQtMTQuMjc4LTI2MS4xNTUtMjkuMzkzbC0uMDE0LDBDNjc2LjU4LDc3LjA1OCw2MjkuMjMzLDY4LjM1Miw1NzUuNTM4LDYxLjdjLTI5LjAxLTMuNTk1LTU3LjEyOC02LjI2NC04NS45NTktOC4xNTktMTUuNjctMS4wMy0zMS43MjktMS44MzMtNDcuNzMxLTIuMzg4LTE2LjgyNy0uNTgxLTM0LjE1OS0uOTA4LTUxLjUxMi0uOTY4LTEuMjM3LDAtMi40NDYtLjAwNi0zLjYtLjAwNi0zMi4wMTQsMC02My41NDksMS41MjgtOTMuNzI4LDQuNTQzQTgwOS4zOTMsODA5LjM5MywwLDAsMCwyMTIuOTYxLDY2LjdjLTQzLjI1NSw4Ljc2OS04My44MDYsMjEtMTIwLjUyOCwzNi4zNDUtMTQuNDI1LDYuMDI4LTI4LjI4OCwxMi41NTktNDEuMiwxOS40MS0xMC4zMzQsNS40ODMtMjAuMDg0LDExLjE4LTI4Ljk4MSwxNi45MzNBMjI4Ljk2NCwyMjguOTY0LDAsMCwwLC41NjUsMTU1WiIKICAgICAgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzNjQuOTk5IDE1NSkgcm90YXRlKDE4MCkiIGZpbGw9IiNlZmY2ZmYiLz4KPC9zdmc+Cg=="
            className="wave" alt="Wave at bottom"></img>
          <div className="logout" onClick={AuthProvider.logout}><FontAwesomeIcon icon={faSignOutAlt} /> Sign Out</div>
          {/* <div className="logout" onClick={AuthProvider.login_twitter}>Link Twitter</div> */}
          <div className="heading_head">
            <h3 className="head">HackTheMidlands 6.0</h3>
            <h1 className="head">Achievements</h1>
            <p className="head">Track your progress throughout the hackathon. The more you learn, the more you earn.</p>
          </div>
          {/* <img src="htm.png" className="logo"> */}
        </div>
        <div className="achieve_grid">
          <AchieveHolder
            name={"Getting Started"}
          >
            <Achievement icon={logo} name={"The First Step"} description={"The first step on a long and happy journey. This is where it all begins."}
              requirements={[{ text: 'Link your Discord', active: true }]}
              active={true}></Achievement>

            <Achievement
              icon={tweet}
              name={"Shout Out"}
              description={"Let us know about your project by tweeting using #HackTheMidlands"}
              active={(achievements.some(e => e.name === 'Shout Out'))}
              requirements={[{ text: <Fragment>Link your <a onClick={AuthProvider.login_twitter}>Twitter</a></Fragment>, active: (user.twitter_id != null) }, //(user.twitter_id!=null)
              { text: "Post a tweet using the #HackTheMidlands", active: false }]}
            >
            </Achievement>

    
          </AchieveHolder>

          <AchieveHolder
            name={"The Main Event"}
          >
            <Achievement icon={map}
              name={"Checkup"}
              active={(achievements.some(e => e.name === 'Checkup'))}
              description={"Join the checkpoint session on Discord and let us know how your project is getting on."}
              requirements={[{ text: "Attend the Checkpoint on Discord at 2PM Date", active: (achievements.some(e => e.name === 'Checkup')) }]}
            ></Achievement>

            <Achievement icon={signboard}
              name={"Check Point 2"}
              active={(achievements.some(e => e.name === 'Check Point 2'))}
              description={"Join the checkpoint session on Discord and let us know how your project is getting on."}
              requirements={[{ text: "Attend the Checkpoint on Discord at 2PM Date", active: (achievements.some(e => e.name === 'Check Point 2')) }]}
            ></Achievement>

            <Achievement icon={workshop}
              name={"Workshop"}
              active={(achievements.some(e => e.name === 'Workshop'))}
              description={"Come along to one of our workshops to get some tips and tricks."}
              requirements={[{ text: "Link your twitch", active: (achievements.some(e => e.name === 'Workshop')) }]}
            ></Achievement>


          </AchieveHolder>

          <AchieveHolder
            name={"Capture That Flag"}
          >
            {/* <Achievement icon={flag} name={"Flag 1"} description={"Its time to test your security skills. Join the CTF and capture that first flag to show us what you've got."} active={(achievements.some(e => e.name === 'Flag 1'))}></Achievement>
            <Achievement icon={flag} name={"Flag 2"} active={(achievements.some(e => e.name === 'Flag 2'))}></Achievement>
            <Achievement icon={flag} name={"Flag 3"} active={(achievements.some(e => e.name === 'Flag 3'))}></Achievement> */}


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
            <p className="head">Track your progress throughout the hackathon. The more you learn, the more you earn.</p>
          </div>
        </div>
        <div className="achieve_grid">
          <div className="achieve_heading">
                Getting Started
            </div>
            <p>
              Its simple! All you have to do is link your Discord!
            </p>
          <div className="discord_login" onClick={AuthProvider.login}><FontAwesomeIcon icon={faDiscord} /> Log In with Discord</div>
        </div>
      </div>
    );
  }
}

export default App;
