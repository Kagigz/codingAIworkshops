# Step by Step

This is a step by step tutorial to call the Computer Vision API and the Custom Vision Service from a ReactJS Web App.

The Web App to start from is provided [here](https://github.com/Kagigz/codingAIworkshops/tree/master/workshop3/start).

## Installs

- [VS Code](https://code.visualstudio.com/download)
- [node.js](https://nodejs.org/en/download/)
- [yarn](https://yarnpkg.com/en/docs/install#windows-stable)

## Setting up the project

- Download this repository: the starting project is in the **workshop3/start** folder
- In the project folder, run `yarn` to install all dependencies
- Start the project with the `yarn start` command

## Creating a Computer Vision service

- Go to the [Azure Portal](https://http://portal.azure.com)
- Click on *Create a Resource* (top left)
- Search for Computer Vision and create a new Computer Vision service
- Choose a name, subscription, location and resource group, and make sure to select F0 as pricing tier
- Click on create, and once the resource is deployed go to it and grab one of your subscription keys (*Keys* tab)

## Calling the Computer Vision API from the web app

We want the Computer Vision API to be called when the image is submitted, so we create a method that we call when the OK button is clicked.

```
handleOK = (url) => {
    this.setState({imgURL:url});
    let jsonContent =  '{"url": ' + '"' + url + '"}';
    this.getInfo(jsonContent);
    
}
```

Create the *getInfo* method that will call the Computer Vision API, and make sure to fill in your subscription key.

```
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
    });

}
```

To observe the results we get back from the API, display the console in your browser (F12).

We now want to store the results in variables.

```
try{
    let result = JSON.parse(jsonResponse);
    let description = result['description']
    let captions = description['captions'];
    let categories = result['categories'];
    let keywords = result['tags'];
}
catch(e){
    console.log(e);
}
```

Update the component's state to that you can store the results in it.


```
this.state = {
    imgURL:null,
    captions:[],
    keywords:[],
    categories:[],
    tags:[]
};
```

Use the *setState* method to update the state with the values we get from the Computer Vision API.

```
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
```

You can now test with any image you find on the internet.

**Tip:** Search for images on google, click on one and wait for it to load completely, then copy the link (right click > copy image link).


## Creating a Custom Vision Service

- Go to [customvision.ai](https://customvision.ai)
- Sign in and create a new classification project
- Upload the images contained in the **trainingImages** folder and tag them
- Train the Custom Vision model
- From the Predictions tab, publish your model
- Click on Prediction URL to get your prediction key and endpoint

## Calling Custom Vision from the web app

Add the list of predictions to the state

```
this.state = {
    imgURL:null,
    captions:[],
    keywords:[],
    categories:[],
    tags:[],
    customPredictions:[]
};
```

Call a method that will call Custom Vision

```
handleOK = (url) => {
    this.setState({imgURL:url});
    let jsonContent =  '{"url": ' + '"' + url + '"}';
    this.getInfo(jsonContent);
    this.getCustomTags(jsonContent);
    
}
```


Define what the *getCustomTags* method does

```
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
    });

}
```

To observe the results we get back from the API, display the console in your browser (F12).

We can now store the results in the state.


```
try{
    let result = JSON.parse(jsonResponse);
    let customPredictions = result["predictions"];
    this.setState({customPredictions});
}
catch(e){
    console.log(e);
}
```


Add the pre-created Custom Vision component to show results

```
<CustomVision predictions={this.state.customPredictions}/>
```


## Testing Custom Vision model

- Kfet4: https://i.imgur.com/RuN1ETS.jpg
- Kfet5: https://i.imgur.com/uTAGS71.jpg
- Kfet6: https://i.imgur.com/zjhD9ot.jpg
- Kfet7: https://i.imgur.com/LpJFxdB.jpg


