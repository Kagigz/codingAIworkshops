import React from 'react';

class UrlUpload extends React.Component{
   
    constructor(props) {    
        super(props);
        this.state = {
            url:""
        };
    }


    render(){
        return (
            <div id="urlUpload" className="input-group">
                <input type="text" ref="urlInput" className="form-control" placeholder="Image URL" aria-label="imageUrl"/>
                <div className="input-group-append">
                <button onClick={ () => this.props.handleOK(this.refs.urlInput.value)} className="input-group-text">OK</button>
                </div>
            </div>
        )
    }
  }
  
  export default UrlUpload;