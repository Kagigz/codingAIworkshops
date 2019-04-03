# Step by Step

This is a step by step tutorial to help you build a Q&A bot.

- Create a [QnA Maker service](https://portal.azure.com/?l=en.en-us#create/hub) and a [QnA Maker Knowledge Base](https://www.qnamaker.ai/)
- Create a Web App Bot (JS SDK v4, Echo Template)
- Download the source code
- Make modifications to the source code
- Publish
- Connect to channels
- Integrate in webchat

## Installs

- [VS Code](https://code.visualstudio.com/download)
- [node.js](https://nodejs.org/en/download/)
- [Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator/releases/tag/v4.3.3)
- [Azure CLI](https://docs.microsoft.com/fr-fr/cli/azure/install-azure-cli-windows?view=azure-cli-latest)


## Make modifications to the source code

From the app folder, run
```
npm install windows-build-tools (may need admin access)
npm install
```

This will install all the needed dependencies.

Start the bot by running
```
npm start
```

Now that the bot is running, you can test it:
In the Bot Framework Emulator, create a new connection (get your *MicrosoftAppId* and *MicrosoftAppPassword* from .env file)
```
Endpoint:
localhost:3978/api/messages
```

Get your KB's settings and add them from the Bot Framework Emulator (+ Service > QnA Maker)
```
POST /knowledgebases/<KB_ID>/generateAnswer
Host: <HOSTNAME>/qnamaker
Authorization: EndpointKey <ENDPOINT_KEY>
Content-Type: application/json
{"question":"<Your question>"}
```

Install the botbuilder-ai package to be able to use QnA Maker
```
npm install --save botbuilder-ai
```

Install the botframework-config package
```
npm install --save botframework-config
```

Restart the bot and use run watch to have it always running after the code is changed
```
npm run watch
```

Add the QnA service configuration into *index.js*
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

Add the bot file path and secret into *.env*
```
botFilePath="./botname.bot"
botFileSecret=""
```

Pass the QnA Maker settings to the Bot
```
const myBot = new MyBot(qnaSettings);
```

Import required modules in *bot.js*
```
const { ActivityHandler, ActivityTypes } = require('botbuilder');
const { QnAMaker, QnAMakerEndpoint, QnAMakerOptions } = require('botbuilder-ai');
```

Change the onMessage method
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

You can now try asking questions and the bot will answer using your KB.

## Publish

Publish your bot by running
```
az bot publish --name <bot-resource-name> --resource-group <resource-group-name> --code-dir '.' --verbose
```

In the web app bot, make sure the botFilePath & botFileSecret are set correctly.

## Integrate in webchat

Download [test.html](), replace your bot name and secret, et voilà!
