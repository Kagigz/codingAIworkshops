# Step by Step

Ceci est un tutoriel step by step pour appeler l'API Computer Vision et le service Custom Vision depuis une appli web ReactJS.

La projet de départ se trouve [ici](https://github.com/Kagigz/codingAIworkshops/tree/master/workshop3/start).

## Installations

- [VS Code](https://code.visualstudio.com/download)
- [node.js](https://nodejs.org/en/download/)
- [yarn](https://yarnpkg.com/en/docs/install#windows-stable)

## Démarrer le projet

- Téléchargez ce repository: le projet de départ se trouve dans le dossier **workshop3/start**
- Dans le dossier du projet, exécutez la commande `yarn` pour installer toutes les dépendances
- Lancez le projet avec la commande `yarn start`

## Créer un service Computer Vision

- Allez sur le [portail Azure](https://http://portal.azure.com)
- Cliquez sur *Create a Resource* (en haut à gauche)
- Cherchez Computer Vision et créez un nouveau service Computer Vision
- Choisissez un nom, souscription, location et groupe de ressources et assurez-vous de choisir F0 pour le pricing tier
- Cliquez sur Créer, et quand la ressource est déployée, cliquez dessus et prenez vos *Subscriptions keys* (*Keys* tab)

## Appeler l'API Computer Vision depuis l'appli web

Tout le code qui suit doit être ajouté dans le fichier *computervision.js* (dossier **src/components**)

On veut que l'API Computer Vision soit appelée lorsqu'une image est envoyée, donc on crée une méthode qui sera appelée lorsque l'on clique sur le bouton OK.

```
handleOK = (url) => {
    this.setState({imgURL:url});
    let jsonContent =  '{"url": ' + '"' + url + '"}';
    this.getInfo(jsonContent);
    
}
```

Créez la méthode *getInfo* qui appelera l'API Computer Vision, et assurez vous de renseigner votre subscription key.

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

Pour observer les résultats que l'on reçoit de l'API, affichez la console dans votre navigateur (F12).
On stocke les résultats dans des variables pour pouvoir les utiliser par la suite.

```
try{
    let result = JSON.parse(jsonResponse);
    let description = result['description']
    let captions = description['captions'];
    let categories = result['categories'];
    let keywords = result['tags'];
    let tags = description['tags'];
}
catch(e){
    console.log(e);
}
```

Changez le state du component pour pouvoir stocker les résultats dedans.

```
this.state = {
    imgURL:null,
    captions:[],
    keywords:[],
    categories:[],
    tags:[]
};
```

Faites appel à la méthode *setState* pour mettre à jour le state avec les valeurs que l'on reçoit de l'API Computer Vision.

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

Vous pouvez maintenant tester avec les images que vous voulez.

**Tip:** Cherchez des images sur Google (ou Bing Search ;) ), cliquez sur une et attendez qu'elle charge complètement, puis copiez le lien (clic droit > Copier l'adresse de l'image).


## Créer un service Custom Vision

- Allez sur [customvision.ai](https://customvision.ai)
- Identifiez-vous et créez un nouveau projet de classification
- Uploadez les images qui sont dans le dossier **trainingImages** et taggez les
- Entraînez le modèle (bouton *Train*)
- Depuis le tab Prediction, publiez votre modèle
- Cliquez sur Prediction URL pour récupérer votre subscription key et endpoint

## Appeler Custom Vision depuis l'appli web

Ajoutez dans le state ce qui va contenir la liste de prédictions

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

Appelez une méthode qui va appeler Custom Vision

```
handleOK = (url) => {
    this.setState({imgURL:url});
    let jsonContent =  '{"url": ' + '"' + url + '"}';
    this.getInfo(jsonContent);
    this.getCustomTags(jsonContent);
    
}
```


Definissez ce que la méthode *getCustomTags* fait

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

Pour observer les résultats que l'on reçoit de l'API, affichez la console dans votre navigateur (F12).
On peut maintenant stocker les résultats dans le state.


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

Ajoutez le component pré-créé Custom Vision pour afficher les résultats.

```
<CustomVision predictions={this.state.customPredictions}/>
```


## Tester le modèle Custom Vision

- Kfet4: https://i.imgur.com/RuN1ETS.jpg
- Kfet5: https://i.imgur.com/uTAGS71.jpg
- Kfet6: https://i.imgur.com/zjhD9ot.jpg
- Kfet7: https://i.imgur.com/LpJFxdB.jpg


