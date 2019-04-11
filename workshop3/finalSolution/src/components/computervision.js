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
          captions:[],
          keywords:[],
          categories:[],
          tags:[],
          customPredictions:[]
        };
         
      }

    getInfo = (content) => {

        const subscriptionKey = 'YOUR_SUBSCRIPTION_KEY';
        const uriBase = 'https://westeurope.api.cognitive.microsoft.com/vision/v2.0/analyze';

        const params = {
            'visualFeatures': 'Categories,Description,Tags',
            'details': '',
            'language': 'en'
        };
        
        const options = {
            uri: uriBase,
            qs: params,
            body:content,
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key' : subscriptionKey
            }
        };
        
        request.post(options, (error, response, body) => {
          if (error) {
            console.log('Error: ', error);
            return;
          }

          let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
          console.log('Computer Vision API Response\n');
          console.log(jsonResponse);

          try{
            let result = JSON.parse(jsonResponse);
            let description = result['description']
            let captions = description['captions'];
            let categories = result['categories'];
            let keywords = result['tags'];
            let tags = description['tags'];
            this.setState({captions});
            this.setState({categories});
            this.setState({keywords});
            this.setState({tags});
          }
          catch(e){
              console.log(e);
          }

        });

    }

    getCustomTags = (content) => {

        const predictionKey = 'YOUR_PREDICTION_KEY';
        const predictionEndpoint = 'YOUR_PREDICTION_ENDPOINT';

        const options = {
            uri: predictionEndpoint,
            body:content,
            headers: {
                'Content-Type': 'application/json',
                'Prediction-Key' : predictionKey
            }
        };
        
        request.post(options, (error, response, body) => {
          if (error) {
            console.log('Error: ', error);
            return;
          }

          let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
          console.log('Custom Vision Response\n');
          console.log(jsonResponse);

          try{
            let result = JSON.parse(jsonResponse);
            let customPredictions = result["predictions"];
            this.setState({customPredictions});
          }
          catch(e){
              console.log(e);
          }
        });

    }
    
    handleOK = (url) => {
        this.setState({imgURL:url});
        let jsonContent =  '{"url": ' + '"' + url + '"}';
        this.getInfo(jsonContent);
        this.getCustomTags(jsonContent);
        
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

            <CustomVision predictions={this.state.customPredictions}/>

        </div>
        )
    }
  }
  
  export default ComputerVision;