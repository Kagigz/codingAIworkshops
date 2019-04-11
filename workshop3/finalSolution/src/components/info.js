import React from 'react';
import NameConfidence from './nameconfidence'
const uuid = require('uuid/v1');

class Info extends React.Component{

    
    constructor(props) {    
        super(props);
        this.state = {
          tags: [],
          captions: [],
          keywords: [],
          categories: [],
        };
      }

      componentWillReceiveProps(){
          this.setState({tags:this.props.tags});
          this.setState({captions:this.props.captions});
          this.setState({keywords:this.props.keywords});
          this.setState({categories:this.props.categories});
      }

    render(){
        var tagsList = "";
        var captions = "";
        var keywords = "";
        var categories = "";
        
        try{
        captions = this.state.captions
            .map(item => <NameConfidence key={uuid()} name={item.text} confidence={item.confidence}/>);
        keywords = this.state.keywords
            .map(item => <NameConfidence key={uuid()} name={item.name} confidence={item.confidence}/>);
        categories = this.state.categories
            .map(item => <NameConfidence key={uuid()} name={item.name} confidence={item.score}/>);
        tagsList = this.state.tags
            .map(tag => <div key={uuid()} className="tag">{tag}</div> );
        }
        catch(e){
            console.log(e);
        }

        return (
            <div id="info">
                <h3 id="infoTitle">Info</h3>

                <div className="infoSection" id="captions">
                <h4>Captions</h4>
                    {captions}
                </div>

                <div className="infoSection" id="keywords">
                <h4>Keywords</h4>
                    {keywords}
                </div>
    
                <div className="infoSection" id="categories">
                <h4>Categories</h4>
                    {categories}
                </div>

                <div className="infoSection" id="tagsList">
                <h4>Tags</h4>
                    {tagsList}
                </div>

            </div>
        )
    }
  }
  
  export default Info;