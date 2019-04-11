import React from 'react';

class ImageView extends React.Component{


    render(){
        return (
        <div id="imageView">
        <img id="imgFile" src={this.props.imgURL}/>
        </div>
        )
    }
  }
  
  export default ImageView;