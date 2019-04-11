import React from 'react';
import Prediction from './prediction'
const uuid = require('uuid/v1');

class CustomVision extends React.Component{

    
    constructor(props) {    
        super(props);
        this.state = {
          predictions: []
        };
      }

    componentWillReceiveProps(){
        this.setState({predictions:this.props.predictions});
    }

    render(){

        var predictions = "";
        
        try{
        predictions = this.state.predictions
            .map(item => <Prediction key={uuid()} tag={item.tagName} confidence={item.probability}/>);
        }
        catch(e){
            console.log(e);
        }

        return (
          <div className="row align-middle" id="customVision">
                <div className="col-md-4"><h5>Custom Vision result</h5></div>
                <div className="col-md-8">
                  {predictions}
                </div>
            </div>
        )
    }
  }
  
  export default CustomVision;