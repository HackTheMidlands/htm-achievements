
import { FontAwesomeIcon } from  '@fortawesome/react-fontawesome'//'./nofortawesome/react-fontawesome'
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FcAbout } from "react-icons/fc";
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'




export function AchieveHolder(props) {
    return (
        <div className="achieve_holder_master">
            <div className="achieve_heading">
                {props.name}
            </div>
            <div className="achieve_holder">
                {props.children}
            </div>
        </div>
    )
}


export class Achievement extends Component {
    constructor(props) {
        super(props);
        this.state = { active: false };
        this.wrapperRef = React.createRef();
        // this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    /**
     * Alert if clicked on outside of element
     */
    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.setState({active:false})
        }
    }

    render() {

            return (
                <div className="achieve_box" ref={this.wrapperRef}>
                    <div className={this.props.active?"achieve":"achieve_disactive"} onClick={() => this.setState({ active: true })} >{this.props.icon}</div>
                    <ToolTip active={this.state.active} name={this.props.name} desc={this.props.description} requirements={this.props.requirements}></ToolTip>
                    <div className="achieve_label">{this.props.name}</div>
                </div>
            )
      
    }
}

// Achievement.propTypes = {
//     children: PropTypes.element.isRequired,
// };


export function ToolTip(props) {

        let requirements=[]

        for (let i=0; i< props.requirements.length;i++){
            if(props.requirements[i].active){
                requirements.push(<div  className="green">
                <FontAwesomeIcon icon={faCheckCircle} /> {props.requirements[i].text }  
                 </div>)
            }else{
                requirements.push(<div  >
                <FontAwesomeIcon icon={faTimesCircle} /> {props.requirements[i].text }  
                 </div>)
            }
          
        }

        return (

            <div className={(props.active)?"tool_tip active":"tool_tip"}>

                <h2 className="tool_tip_inner">{props.name}</h2>
                <p className="tool_tip_inner">{props.desc}
                </p>
                <h3 className="tool_tip_inner">Requirements: </h3>
                <div className="tool_tip_inner_req">

                    {requirements}
                </div>

            </div>)


}