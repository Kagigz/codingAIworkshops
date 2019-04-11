import React from 'react';
import UrlUpload from './urlupload';
import ImageView from './imageView';
import Info from './info';
import CustomVision from './customvision'

const request = require('request');

class ComputerVision extends React.Component{

    
    constructor(props) {    
        super(props);
    
        this.state = {
          imgURL:null,
          captions:[
            {
              "text": "a large green field with a mountain in the background",
              "confidence": 0.9311919582648688
            }
          ],
          keywords:[
            {
              "name": "grass",
              "confidence": 0.9995735287666321
            },
            {
              "name": "sky",
              "confidence": 0.9977013468742371
            },
            {
              "name": "mountain",
              "confidence": 0.9937769174575806
            },
            {
              "name": "outdoor",
              "confidence": 0.9894623160362244
            },
            {
              "name": "nature",
              "confidence": 0.9668680429458618
            },
            {
              "name": "field",
              "confidence": 0.7994658350944519
            },
            {
              "name": "green",
              "confidence": 0.6800251603126526
            },
            {
              "name": "lush",
              "confidence": 0.4075382649898529
            },
            {
              "name": "grassy",
              "confidence": 0.40324124693870544
            },
            {
              "name": "hillside",
              "confidence": 0.33290475606918335
            },
            {
              "name": "pasture",
              "confidence": 0.31319373846054077
            },
            {
              "name": "overlooking",
              "confidence": 0.2572254538536072
            },
            {
              "name": "highland",
              "confidence": 0.21684426069259644
            },
            {
              "name": "surrounded",
              "confidence": 0.15440058708190918
            },
            {
              "name": "landscape",
              "confidence": 0.12518022169319595
            }
          ],
          categories:[
            {
              "name": "outdoor_mountain",
              "score": 0.8515625,
              "detail": {
                "landmarks": []
              }
            }
          ],
          tags:[
            "grass",
            "mountain",
            "outdoor",
            "nature",
            "field",
            "green",
            "grazing",
            "hill",
            "lush",
            "grassy",
            "sitting",
            "hillside",
            "sheep",
            "pasture",
            "large",
            "standing",
            "overlooking",
            "view",
            "herd",
            "white",
            "dirt",
            "sign",
            "blue",
            "man"
          ]
        };
         
      }


    handleOK = (url) => {
        this.setState({imgURL:url});        
    }

    render(){
        return (
        <div className="container" id="main">
            <UrlUpload handleOK={this.handleOK}/>
            <div className="row" id="imageAnalysis">
                <div className="col-md-9" id="imageViewWrapper">
                    <ImageView imgURL={this.state.imgURL}/>
                </div>
                <div className="col-md-3 scrollbar">
                    <Info captions={this.state.captions} keywords={this.state.keywords} categories={this.state.categories} tags={this.state.tags}/>
                </div>
            </div>

        </div>
        )
    }
  }
  
  export default ComputerVision;