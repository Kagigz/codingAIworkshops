// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, ActivityTypes } = require('botbuilder');
const { QnAMaker, QnAMakerEndpoint, QnAMakerOptions } = require('botbuilder-ai');

class MyBot extends ActivityHandler {
    constructor(qnaSettings) {
        super();

        this.qnaMaker = new QnAMaker(qnaSettings, {});

        this.onMessage(async turnContext => { 
        
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
        
        });

        this.onConversationUpdate(async turnContext => { console.log('this gets called (conversatgion update'); await turnContext.sendActivity('[conversationUpdate event detected]'); });
    }

}

module.exports.MyBot = MyBot;
