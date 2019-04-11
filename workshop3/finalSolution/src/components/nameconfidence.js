import React from 'react';

class NameConfidence extends React.Component{

    
    constructor(props) {    
        super(props);
        this.state = {
          name: "",
          confidence:0
        };
      }

    componentWillMount(){
      this.setState({name:this.props.name});
      this.setState({confidence:Math.round(this.props.confidence*100)});
    }

    render(){
        return (
            <div className="nameConfidence">
                <div className="nameConfidenceTitle">{this.state.name}</div>
                <div className="progress">
                  <div className="progress-bar" role="progressbar" style={{width: this.state.confidence + '%'}} aria-valuenow={this.state.confidence} aria-valuemin="0" aria-valuemax="100">{this.state.confidence}%</div>
                </div>
            </div>
        )
    }
  }
  
  export default NameConfidence;