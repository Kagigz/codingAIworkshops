# Step by Step

Ceci est un tutoriel step by step pour apprendre à faire un bot Q&A.

- Créez un [service QnA Maker](https://portal.azure.com/?l=en.en-us#create/hub) et une [QnA Maker Knowledge Base](https://www.qnamaker.ai/)
- Créez une Web App Bot (JS SDK v4, Echo Template)
- Téléchargez le code source
- Faites des modifications au code source
- Publiez
- Connectez à des canaux
- Intégrez dans un site web

## Installations

- [VS Code](https://code.visualstudio.com/download)
- [node.js](https://nodejs.org/en/download/)
- [Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator/releases/tag/v4.3.3)
- [Azure CLI](https://docs.microsoft.com/fr-fr/cli/azure/install-azure-cli-windows?view=azure-cli-latest)


## Faites des modifications au code source

Depuis le dossier de l'application, exécutez
```
npm install windows-build-tools (may need admin access)
npm install
```

Cela installera toutes les dépendances nécessaires.

Lancez le bot en faisant
```
npm start
```

Maintenant que le bot est lancé, vous pouvez le tester :
Dans le Bot Framework Emulator, créez une nouvelle connexion (vous trouverez le *MicrosoftAppId* et *MicrosoftAppPassword* dans le fichier .env)
```
Endpoint:
localhost:3978/api/messages
```

Prenez les settings de votre KB QnA Maker et ajoutez le service depuis le Bot Framework Emulator (+ Service > QnA Maker)
```
POST /knowledgebases/<KB_ID>/generateAnswer
Host: <HOSTNAME>/qnamaker
Authorization: EndpointKey <ENDPOINT_KEY>
Content-Type: application/json
{"question":"<Your question>"}
```

Installez le package botbuilder-ai pour pouvoir utiliser QnA Maker dans votre bot
```
npm install --save botbuilder-ai
```

Installez le package botframework-config
```
npm install --save botframework-config
```

Redémarrez le bot avec run watch pour avoir les modifications en temps réel dès que vous sauvegardez un fichier
```
npm run watch
```

Ajouter la configuration sur service QnA à *index.js*
```
const { BotConfiguration } = require('botframework-config');
```

```
const QNA_CONFIGURATION = 'DemoKB';

const BOT_FILE = path.join(__dirname, (process.env.botFilePath || ''));
let botConfig;
try {
    //console.log(ENV_FILE.botFileSecret)
    // Read bot configuration from .bot file.

    botConfig = BotConfiguration.loadSync(BOT_FILE, process.env.botFileSecret);
    
} catch (err) {
    console.error(`\nError reading bot file. Please ensure you have valid botFilePath and botFileSecret set for your environment.`);
    console.error(`\n - You can find the botFilePath and botFileSecret in the Azure App Service application settings.`);
    console.error(`\n - If you are running this bot locally, consider adding a .env file with botFilePath and botFileSecret.`);
    console.error(`\n - See https://aka.ms/about-bot-file to learn more about .bot file its use and bot configuration.\n\n`);
    process.exit();
}
const qnaConfig = botConfig.findServiceByNameOrId(QNA_CONFIGURATION);

// Map the contents to the required format for `QnAMaker`.
const qnaSettings = {
    knowledgeBaseId: qnaConfig.kbId,
    endpointKey: qnaConfig.endpointKey,
    host: qnaConfig.hostname
};

```

Ajoutez le botFilePath et botFileSecret dans le fichier *.env*
```
botFilePath="./botname.bot"
botFileSecret=""
```

Passez les settings QnAMaker au bot
```
const myBot = new MyBot(qnaSettings);
```

Importez les modules nécessaires *bot.js*
```
const { ActivityHandler, ActivityTypes } = require('botbuilder');
const { QnAMaker, QnAMakerEndpoint, QnAMakerOptions } = require('botbuilder-ai');
```

Changez la méthode onMessage
```
 // By checking the incoming Activity type, the bot only calls QnA Maker in appropriate cases.
    if (turnContext.activity.type === ActivityTypes.Message) {
        // Perform a call to the QnA Maker service to retrieve matching Question and Answer pairs.
        const qnaResults = await this.qnaMaker.generateAnswer(turnContext.activity.text);

        // If an answer was received from QnA Maker, send the answer back to the user.
        if (qnaResults[0]) {
            await turnContext.sendActivity(qnaResults[0].answer);

        // If no answers were returned from QnA Maker, reply with help.
        } else {
            await turnContext.sendActivity('Sorry, I don\'t know how to help you with that.');
        }

    // If the Activity is a ConversationUpdate, send a greeting message to the user.
    } else if (turnContext.activity.type === ActivityTypes.ConversationUpdate &&
                turnContext.activity.recipient.id !== turnContext.activity.membersAdded[0].id) {
        await turnContext.sendActivity('How can I help you?');

    // Respond to all other Activity types.
    } else if (turnContext.activity.type !== ActivityTypes.ConversationUpdate) {
        await turnContext.sendActivity(`[${ turnContext.activity.type }]-type activity detected.`);
    }
```

Vous pouvez maintenant poser des questions au bot et il répondra en fonction de ce que vous avez dans votre KB.

## Publiez

Publiez votre bot en exécutant
```
az bot publish --name <bot-resource-name> --resource-group <resource-group-name> --code-dir '.' --verbose
```

Dans la web app bot, vérifiez que botFilePath & botFileSecret sont bien renseignés dans les App Settings.

## Intégrez dans un site web

Téléchargez [test.html](https://github.com/Kagigz/codingAIworkshops/blob/master/workshop2/test.html), remplacez le nom de votre bot et votre secret, et voilà!
