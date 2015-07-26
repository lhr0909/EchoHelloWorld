exports.handler = function(event, context) {
    try {
        var request = event.request;
        var session = event.session;

        if (request.type === "LaunchRequest") {
            var sessionAttr = {};
            var output = "Hi! I don't know your name yet. Tell me your name by saying, my name is blah blah blah.";
            var reprompt = "Hey I still don't know your name, want to tell me your name?";
            context.succeed(respond(sessionAttr, output, reprompt, false));
        } else if (request.type === "SessionEndedRequest") {
            context.succeed();
        } else if (request.type === "IntentRequest") {
            var intent = request.intent;

            if (intent.name === "SetName") {
                var name = intent.slots.Name.value;
                if (name) {
                    var sessionAttr = {name: name};
                    var output = "I got it. Your name is " + name + ". Feel free to ask me about your name, and I will remember that.";
                    var reprompt = "So you don't want to try if I get your name right? Ask me if I still remember your name."
                    context.succeed(respond(sessionAttr, output, reprompt, false));
                } else {
                    var sessionAttr = {};
                    var output = "Hmm, I didn't get that. Can you say that again?";
                    var reprompt = "I still didn't hear that. Try again by saying, my name is blah blah blah.";
                    context.succeed(respond(sessionAttr, output, reprompt, false));
                }
                
            } else if (intent.name === "GetName") {
                var sessionAttr = session.attributes;
                if (sessionAttr && sessionAttr.name) {
                    var name = sessionAttr.name;
                    var output = "Your name is " + name + ". Did I get it right?";
                    var reprompt = "";
                    context.succeed(respond(sessionAttr, output, reprompt, true));
                } else {
                    var output = "Hmm. I might have forgotten your name. Let's try again.";
                    var reprompt = "I still didn't hear that. Try again by saying, my name is blah blah blah.";
                    context.succeed(respond(sessionAttr, output, reprompt, false));
                }
            }
        }
    } catch (e) {
        context.fail("Exception - " + e);
    }
};

function respond(sessionAttr, output, reprompt, shouldEnd) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttr,
        response: {
            outputSpeech: {
                type: "PlainText",
                text: output
            },
            card: {
                type: "Simple",
                title: "",
                content: ""
            },
            reprompt: {
                outputSpeech: {
                    type: "PlainText",
                    text: reprompt
                }
            },
            shouldEndSession: shouldEnd
        }
    };
}