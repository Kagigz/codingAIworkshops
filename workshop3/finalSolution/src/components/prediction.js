import React from 'react';

class Prediction extends React.Component{

    
    constructor(props) {    
        super(props);
        this.state = {
          tag: "",
          confidence:0
        };
      }

    componentWillMount(){
      this.setState({tag:this.props.tag});
      this.setState({confidence:Math.round(this.props.confidence*100)});
    }

    render(){
        return (
            <span className="prediction">
                <span className="predictionTitle">{this.state.tag}</span> {this.state.confidence}%
            </span>
        )
    }
  }
  
  export default Prediction;