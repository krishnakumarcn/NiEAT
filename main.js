"use strict";

const express = require("express");
const bodyParser = require("body-parser");
var firebase = require("firebase");

var config = {
  apiKey: "AIzaSyAs059e9KN9mqyHucW1xyZ4zuqR4B731rc",
  authDomain: "nieat-9eb0f.firebaseapp.com",
  databaseURL: "https://nieat-9eb0f.firebaseio.com",
  projectId: "nieat-9eb0f",
  storageBucket: "nieat-9eb0f.appspot.com",
  messagingSenderId: "793060807751"
};

firebase.initializeApp(config);

const restService = express();

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.post("/orderMeal", function(req, res) {
  //  switch (req.body.result.contexts.name) {
  //     //Speech Synthesis Markup Language
  //     case "music one":

  // var state =
  //   req.body.result &&
  //   req.body.result.parameters &&
  //   req.body.result.parameters.members
  //     ? req.body.result.parameters.members
  //     : "Seems like some problem. Speak again.";
  // var value = req.body.result.parameters.members;

  //   var database = firebase.database();
  //     firebase.database().ref('smartHome').set({
  //     light: value

  //   });

  //

  var cardResponse = {
    platform: "ACTIONS_ON_GOOGLE",
    card: {
      title: "card title",
      subtitle: "card subtitle",
      imageUri: "https://example.com/image.jpg",
      buttons: [
        {
          text: "Button Text",
          postback: "https://example.com"
        }
      ]
    }
  };

  var helperResponse = {
    payload: {
      google: {
        expectUserResponse: true,
        richResponse: {
          items: [
            {
              simpleResponse: {
                textToSpeech: "this is a simple response"
              }
            }
          ]
        }
      }
    }
  };
  return res.json(cardResponse);

  ///////////////////////////////////////////////////////////////
  var db = firebase.firestore();

  db.collection("orders")
    .doc("2019-02-22T14:00:00+05:30")
    .set({
      datetime: "TESTDT",
      dish: "TESTBIRIYANI",
      quantity: 2,
      status: "ordered",
      userid: "ndh00300"
    })
    .then(function(resp) {
      console.log("resp is" + resp);
      return res.json({
        //     speech: state + " is the speech",
        speech: " This is the speech",
        displayText: "This is the state",
        source: "webhook-echo-sample"
      });
      // agent.add('success');
      // agent.add(`Nieat, This is Welcome to my agent!`);
    })
    .catch(function(error) {
      console.log("error is: " + error);
      return res.json({
        //     speech: state + " is the speech",
        speech: " This is the speech",
        displayText: "This is the state",
        source: "webhook-echo-sample"
      });
      // agent.add('caught error');
      // agent.add(`Nieat, Poda pattee... eroor`);
    });
  ///////////////////////////////////////////
  return res.json({
    //     speech: state + " is the speech",
    speech: " This is the speech",
    displayText: "This is the state",
    source: "webhook-echo-sample"
  });
});

restService.post("/audio", function(req, res) {
  var speech = "";
  switch (req.body.result.parameters.AudioSample.toLowerCase()) {
    //Speech Synthesis Markup Language
    case "music one":
      speech =
        '<speak><audio src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio></speak>';
      break;
    case "music two":
      speech =
        '<speak><audio clipBegin="1s" clipEnd="3s" src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio></speak>';
      break;
    case "music three":
      speech =
        '<speak><audio repeatCount="2" soundLevel="-15db" src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio></speak>';
      break;
    case "music four":
      speech =
        '<speak><audio speed="200%" src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio></speak>';
      break;
    case "music five":
      speech =
        '<audio src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio>';
      break;
    case "delay":
      speech =
        '<speak>Let me take a break for 3 seconds. <break time="3s"/> I am back again.</speak>';
      break;
    //https://www.w3.org/TR/speech-synthesis/#S3.2.3
    case "cardinal":
      speech = '<speak><say-as interpret-as="cardinal">12345</say-as></speak>';
      break;
    case "ordinal":
      speech =
        '<speak>I stood <say-as interpret-as="ordinal">10</say-as> in the class exams.</speak>';
      break;
    case "characters":
      speech =
        '<speak>Hello is spelled as <say-as interpret-as="characters">Hello</say-as></speak>';
      break;
    case "fraction":
      speech =
        '<speak>Rather than saying 24+3/4, I should say <say-as interpret-as="fraction">24+3/4</say-as></speak>';
      break;
    case "bleep":
      speech =
        '<speak>I do not want to say <say-as interpret-as="bleep">F&%$#</say-as> word</speak>';
      break;
    case "unit":
      speech =
        '<speak>This road is <say-as interpret-as="unit">50 foot</say-as> wide</speak>';
      break;
    case "verbatim":
      speech =
        '<speak>You spell HELLO as <say-as interpret-as="verbatim">hello</say-as></speak>';
      break;
    case "date one":
      speech =
        '<speak>Today is <say-as interpret-as="date" format="yyyymmdd" detail="1">2017-12-16</say-as></speak>';
      break;
    case "date two":
      speech =
        '<speak>Today is <say-as interpret-as="date" format="dm" detail="1">16-12</say-as></speak>';
      break;
    case "date three":
      speech =
        '<speak>Today is <say-as interpret-as="date" format="dmy" detail="1">16-12-2017</say-as></speak>';
      break;
    case "time":
      speech =
        '<speak>It is <say-as interpret-as="time" format="hms12">2:30pm</say-as> now</speak>';
      break;
    case "telephone one":
      speech =
        '<speak><say-as interpret-as="telephone" format="91">09012345678</say-as> </speak>';
      break;
    case "telephone two":
      speech =
        '<speak><say-as interpret-as="telephone" format="1">(781) 771-7777</say-as> </speak>';
      break;
    // https://www.w3.org/TR/2005/NOTE-ssml-sayas-20050526/#S3.3
    case "alternate":
      speech =
        '<speak>IPL stands for <sub alias="indian premier league">IPL</sub></speak>';
      break;
  }
  return res.json({
    speech: speech,
    displayText: speech,
    source: "webhook-echo-sample"
  });
});

restService.post("/video", function(req, res) {
  return res.json({
    speech:
      '<speak>  <audio src="https://www.youtube.com/watch?v=VX7SSnvpj-8">did not get your MP3 audio file</audio></speak>',
    displayText:
      '<speak>  <audio src="https://www.youtube.com/watch?v=VX7SSnvpj-8">did not get your MP3 audio file</audio></speak>',
    source: "webhook-echo-sample"
  });
});

restService.post("/slack-test", function(req, res) {
  var slack_message = {
    text: "Details of JIRA board for Browse and Commerce",
    attachments: [
      {
        title: "JIRA Board",
        title_link: "http://www.google.com",
        color: "#36a64f",

        fields: [
          {
            title: "Epic Count",
            value: "50",
            short: "false"
          },
          {
            title: "Story Count",
            value: "40",
            short: "false"
          }
        ],

        thumb_url:
          "https://stiltsoft.com/blog/wp-content/uploads/2016/01/5.jira_.png"
      },
      {
        title: "Story status count",
        title_link: "http://www.google.com",
        color: "#f49e42",

        fields: [
          {
            title: "Not started",
            value: "50",
            short: "false"
          },
          {
            title: "Development",
            value: "40",
            short: "false"
          },
          {
            title: "Development",
            value: "40",
            short: "false"
          },
          {
            title: "Development",
            value: "40",
            short: "false"
          }
        ]
      }
    ]
  };
  return res.json({
    speech: "speech",
    displayText: "speech",
    source: "webhook-echo-sample",
    data: {
      slack: slack_message
    }
  });
});

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
