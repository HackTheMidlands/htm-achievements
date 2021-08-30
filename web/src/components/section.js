import logo from "../resources/discord.png";
import cpu from "../resources/cpu.png";
// im;
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
export function AchieveHolder(props) {
    return (
        <div class="achieve_holder_master">
            <div class="achieve_heading">
                {props.name}
            </div>
            {/* <div class="achieve_holder_holder"> */}
            <div class="achieve_holder">
                {props.children}
        

                {/* <!-- <div></div> -->

            <div class="achieve_box">
                <img class="achieve" src="discord.png">
            </div>
            <div class="achieve_box">
                <img class="achieve" src="discord.png">
            </div>
            <div class="achieve_box">
                <img class="achieve_disactive" src="discord.png">
            </div> */}
            {/* </div> */}
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
        console.log("mount")
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
        }else{
            // this.setState({active:true})
        }
    }

    render() {

            return (
                <div className="achieve_box" ref={this.wrapperRef}>
                    <img className={this.props.active?"achieve":"achieve_disactive"} onClick={() => this.setState({ active: true })} src={this.props.icon}></img>
                    <ToolTip active={this.state.active} name={this.props.name} desc={this.props.description} requirements={this.props.requirements}></ToolTip>
                    <div class="achieve_label">{this.props.name}</div>
                </div>
            )
      
    }
}

Achievement.propTypes = {
    children: PropTypes.element.isRequired,
};

// export function Achievement(props) {

//     if (props.active) {
//         return (
//             <div className="achieve_box">
//                 <img className="achieve" src={logo}></img>
//                 <ToolTip name={"The First Step"} desc={"Click the button"}></ToolTip>
//             </div>
//         )
//     } else {
//         return (<div className="achieve_box">
//             <img className="achieve_disactive" src={logo}></img>
//             <ToolTip name={"The First Step"} desc={"Click the button"}></ToolTip>
//         </div>)
//     }

// }



export function ToolTip(props) {

        let requirements=[]
        console.log(props)
        for (let i=0; i< props.requirements.length;i++){
            requirements.push(<div className={props.requirements[i].active?"green":""}>{props.requirements[i].text } </div>)
        }
    //if (props.active) {
        return (

            <div className={(props.active)?"tool_tip active":"tool_tip"}>

                <h2 className="tool_tip_inner">{props.name}</h2>
                <p className="tool_tip_inner">{props.desc}
                </p>
                <h3 className="tool_tip_inner">Requirements: </h3>
                <p className="tool_tip_inner done">

                    {requirements}
                </p>

            </div>)
  //  }
    // else {
    //     return (<div class="tool_tip"></div>)
    // }

}