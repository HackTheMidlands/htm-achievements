// import logo from './logo.svg';
import './App.css';
import 'bulma/css/bulma.min.css';
import * as AuthProvider from "./providers/AuthProvider";
import { Achievement, AchieveHolder } from "./components/section";
import React, { useState, useEffect, Fragment } from 'react';
import { FontAwesomeIcon } from  '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import {faDiscord} from '@fortawesome/free-brands-svg-icons'
import {Helmet} from "react-helmet";
import {AiFillTwitterSquare} from 'react-icons/ai'
import {BsDiscord} from 'react-icons/bs'
import {BiCoffeeTogo} from 'react-icons/bi'
import {FaEarlybirds, FaRobot, FaPaintRoller, FaGamepad,FaPaintBrush} from 'react-icons/fa'
import {GiEasterEgg, GiOwl, GiSharpSmile, GiSacrificialDagger, GiUnicorn,GiNails, GiSparkSpirit, GiMegabot} from 'react-icons/gi'
import {FcClock} from 'react-icons/fc'
import {GrArchlinux} from 'react-icons/gr'
import {SiVim, SiDiscord, SiBytedance} from 'react-icons/si'
import {ImShocked} from 'react-icons/im'

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
  const CTFs = [
    "Terms of Service",
    "Find Me",
    "PingIT",
    "Commitment Issues",
    "Totally Cool Bookings",
    "Deep Dive",
    "Flag Checker",
    "Address Book"
  ]

  const mainAchieves = [
    {
      name: "By the way",
      description: "Awarded when you mention (arch) linux",
      icon: <GrArchlinux/>,
    },
    {
      name: "Their one purpose",
      description: "Awarded when you interact with a bot on the HTM Discord",
      icon: <FaRobot/>,
    },
    {
      name: "Night owl",
      description: "Awarded when you message late at night",
      icon: <GiOwl/>,
    },
    {
      name: "Early bird",
      description: "Awarded when you message really early on the HTM Discord",
      icon: <FaEarlybirds/>,
    },
    {
      name: "Smile",
      description:
        "Awarded when you post in the pics-and-stuff on the HTM Discord",
      icon: <GiSharpSmile/>,
    },
    {
      name: "Over a coffee",
      description:
        "Awarded when you post in the chat-with-sponsors channel on the HTM discord",
      icon: <BiCoffeeTogo/>,
    },
    {
      name: "Nice to meet you",
      description:
        "Awarded when you post in the introductions channel on the HTM Discord",
      icon: <FaPaintRoller/>,
    },
    {
      name: "How do I quit?",
      description: "Awarded when you use the Vim emoji",
      icon: <SiVim/>,
    },
    {
      name: "Boosted",
      description: "When they boost the Server :D",
      icon: <SiDiscord/>,
    },
    {
      name: "Willing Sacrifice",
      description: "Signed up for a mentor role",
      icon: <GiSacrificialDagger/>,
    },
    {
      name: "Unicorn Farmer",
      description: "Used all HTM unicorns at least once",
      icon: <GiUnicorn/>,
    },
    {
      name: "Eggy Weggy",
      description: "Found a secret easter egg",
      icon: <GiEasterEgg/>,
    },
    {
      name: "Check(point) Mate",
      description: "Turned up to a checkpoint",
      icon: <FcClock/>,
    },
    {
      name: "Tough as Nails",
      description: "DId a hardware hack",
      icon: <GiNails/>,
    },
    {
      name: "Pro Gamer",
      description: "Turned up to a minigame",
      icon: <FaGamepad/>,
    },
    {
      name: "Hacker Spirit",
      description: "Showed true hacker spirit",
      icon: <GiSparkSpirit/>,
    },
    {
      name: "Bot Fanatic",
      description: "Used a Discord Bot",
      icon: <GiMegabot/>,
    },
    {
      name: "Wowzers",
      description: "Submitted a project to Devpost",
      icon: <ImShocked/>,
    },
    {
      name: "Artist",
      description:
        "Collaborate with us to create a spooooooky Bob Ross painting",
      icon: <FaPaintBrush/>,
    },
    {
      name: "Dancer",
      description: "Post a dance in #dances",
      icon: <SiBytedance/>,
    },
  ];

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
        <Helmet>
                <meta charSet="utf-8" />
                <title>Achievements System - HTM 6.0</title>
            </Helmet>
        <div className="header">
          <img
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMzY0Ljk5OSIgaGVpZ2h0PSIxNTUiIHZpZXdCb3g9IjAgMCAxMzY0Ljk5OSAxNTUiPgogICAgPHBhdGggaWQ9IkludGVyc2VjdGlvbl8xIiBkYXRhLW5hbWU9IkludGVyc2VjdGlvbiAxIgogICAgICAgICAgZD0iTTAsMTU1VjBIMTM2NVYxNS4xMTRjLTIuMzI4LDEuMzU3LTEyLjU3NCw3LjIzMi0yOS4wNjIsMTUuMzQtMTEuMDc3LDUuNDQ3LTIyLjc5MiwxMC44MzktMzQuODE5LDE2LjAyNS0xNS4wMzQsNi40ODMtMzAuNjA1LDEyLjY2My00Ni4yODEsMTguMzY5YTg1OS40MTgsODU5LjQxOCwwLDAsMS0xMjEuMjYsMzQuMzk0Yy0yNC4wODMsNC45MjctNDguMzUyLDguNzQtNzIuMTMzLDExLjMzNGE3MjEuNTM0LDcyMS41MzQsMCwwLDEtNzcuOTA3LDQuM2MtMTAxLjMxMSwwLTE3OC45NTQtMTQuMjc4LTI2MS4xNTUtMjkuMzkzbC0uMDE0LDBDNjc2LjU4LDc3LjA1OCw2MjkuMjMzLDY4LjM1Miw1NzUuNTM4LDYxLjdjLTI5LjAxLTMuNTk1LTU3LjEyOC02LjI2NC04NS45NTktOC4xNTktMTUuNjctMS4wMy0zMS43MjktMS44MzMtNDcuNzMxLTIuMzg4LTE2LjgyNy0uNTgxLTM0LjE1OS0uOTA4LTUxLjUxMi0uOTY4LTEuMjM3LDAtMi40NDYtLjAwNi0zLjYtLjAwNi0zMi4wMTQsMC02My41NDksMS41MjgtOTMuNzI4LDQuNTQzQTgwOS4zOTMsODA5LjM5MywwLDAsMCwyMTIuOTYxLDY2LjdjLTQzLjI1NSw4Ljc2OS04My44MDYsMjEtMTIwLjUyOCwzNi4zNDUtMTQuNDI1LDYuMDI4LTI4LjI4OCwxMi41NTktNDEuMiwxOS40MS0xMC4zMzQsNS40ODMtMjAuMDg0LDExLjE4LTI4Ljk4MSwxNi45MzNBMjI4Ljk2NCwyMjguOTY0LDAsMCwwLC41NjUsMTU1WiIKICAgICAgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzNjQuOTk5IDE1NSkgcm90YXRlKDE4MCkiIGZpbGw9IiNlZmY2ZmYiLz4KPC9zdmc+Cg=="
            className="wave" alt="Wave at bottom"></img>
          <div className="logout" onClick={AuthProvider.logout}><FontAwesomeIcon icon={faSignOutAlt} /> Sign Out</div>
          {/* <div className="logout" onClick={AuthProvider.login_twitter}>Link Twitter</div> */}
          <div className="heading_head">
            <h3 className="head">HackTheMidlands 6.0</h3>
            <h1 className="head">Achievements</h1>
            <p className="head">Track your progress throughout the hackathon 🥳</p>
          </div>
          {/* <img src="htm.png" className="logo"> */}
        </div>
        <div className="achieve_grid">
          <AchieveHolder
            name={"Getting Started"}
          >
            <Achievement icon={<img src={logo}/>} name={"The First Step"} description={"The first step on a long and happy journey. This is where it all begins."}
              requirements={[{ text: 'Link your Discord', active: true }]}
              active={true}></Achievement>

            <Achievement
              icon={<img src={tweet}/>}
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
            <Achievement icon={<img src={map}/>}
              name={"Checkup"}
              active={(achievements.some(e => e.name === 'Checkup'))}
              description={"Join the checkpoint session on Discord and let us know how your project is getting on."}
              requirements={[{ text: "Attend the Checkpoint on Discord at 2PM Date", active: (achievements.some(e => e.name === 'Checkup')) }]}
            ></Achievement>

            <Achievement icon={<img src={signboard}/>}
              name={"Check Point 2"}
              active={(achievements.some(e => e.name === 'Check Point 2'))}
              description={"Join the checkpoint session on Discord and let us know how your project is getting on."}
              requirements={[{ text: "Attend the Checkpoint on Discord at 2PM Date", active: (achievements.some(e => e.name === 'Check Point 2')) }]}
            ></Achievement>

            <Achievement icon={<img src={workshop}/>}
              name={"Workshop"}
              active={(achievements.some(e => e.name === 'Workshop'))}
              description={"Come along to one of our workshops to get some tips and tricks."}
              requirements={[{ text: "Link your twitch", active: (achievements.some(e => e.name === 'Workshop')) }]}
            ></Achievement>

          {mainAchieves.map(a =>
            <Achievement key={a} icon={a.icon} name={a.name} description={a.description} requirements={[]} active={(achievements.some(e => e.name === a.name))}></Achievement>
          )}

          </AchieveHolder>

          <AchieveHolder
            name={"Capture That Flag"}
          >
            {CTFs.map(ctf => 
              <Achievement key={ctf} icon={<img src={flag}/>} name={ctf} requirements={[{ text: ctf, active: (achievements.some(e => e.name === ctf)) }]} active={(achievements.some(e => e.name === ctf))}></Achievement>
            )}
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
