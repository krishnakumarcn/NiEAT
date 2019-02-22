"use strict";

const express = require("express");
const bodyParser = require("body-parser");
var firebase = require("firebase");
const axios = require('axios')
// const {WebhookClient} = require('dialogflow-fulfillment');

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
// const agent = new WebhookClient({request: request,response: response});

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.post("/orderMeal", async function(req, res) {
  var returnJSON = {
    payload: {
      google: {
        expectUserResponse: true,
        richResponse: {
          items: [
            {
              simpleResponse: {
                textToSpeech:
                  "Hmmm... I feel a headache.. please try again after some time."
              }
            }
          ]
        }
      }
    }
  };
  var intentName = "";
  if (req.body.queryResult.intent.displayName != null) {
    intentName = req.body.queryResult.intent.displayName;
  }

  switch (intentName) {
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    ////////////////   ORDER FOOD ///////////////////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////

    case "nieat.order.food":
      var fooditem = "";
      var restaurant = "";
      var datetime = "";
      var quantity = 0;
      var status = "pending";
      var userid = "uid_dummy";

      if (req.body.queryResult.parameters.restaurents) {
        restaurant = req.body.queryResult.parameters.restaurents;
      }
      if (req.body.queryResult.parameters.food_item)
        fooditem = req.body.queryResult.parameters.food_item;

      if (req.body.queryResult.parameters["number-integer"])
        quantity = req.body.queryResult.parameters["number-integer"];

      datetime = getDateTime(); //new Data().toString()

      await writeToDB(
        datetime,
        restaurant,
        fooditem,
        quantity,
        status,
        userid,
        res
      );

      break;

    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    ////////////////   SEARCH ORDER //////////////////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////

    case "nieat.search.order":
      returnJSON = {
        payload: {
          google: {
            expectUserResponse: true,
            richResponse: {
              items: [
                {
                  simpleResponse: {
                    textToSpeech: "Search order Intent obtained"
                  }
                }
              ]
            }
          }
        }
      };
      res.json(returnJSON);

      break;

    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    ////////////////    OTHERS     ///////////////////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////

    default:
      returnJSON = {
        payload: {
          google: {
            expectUserResponse: true,
            richResponse: {
              items: [
                {
                  simpleResponse: {
                    textToSpeech: "Unknown intent!"
                  }
                }
              ]
            }
          }
        }
      };
      res.json(returnJSON);
      break;
  }
});

async function writeToDB(
  datetime,
  restaurant,
  fooditem,
  quantity,
  status,
  userid,
  res
) {
  var db = firebase.firestore();

  var retJSON = "";
  db.collection("orders")
    .doc(datetime)
    .set({
      datetime: datetime,
      fooditem: fooditem,
      quantity: quantity,
      restaurant: restaurant,
      status: status,
      userid: userid
    })
    .then(function(resp) {
      console.log("resp is" + resp);

      let respWithFulfil = {
        "fulfillmentText": " This is the displayed and spoken resp",
        "fulfillmentMessages": [
          {
            "text": [
              "text response"
            ],
          }
        ],
        "source": "example.com",
        "payload": {
          "google": {
            "expectUserResponse": true,
            "richResponse": {
              "items": [
                {
                  "simpleResponse": {
                    "textToSpeech": "this is a simple response"
                  }
                }
              ]
            }
          },
          "facebook": {
            "text": "Hello, Facebook!"
          },
          "slack": {
            "text": "This is a text response for Slack."
          }
        },
        "outputContexts": [
          {
            "name": "projects/${PROJECT_ID}/agent/sessions/${SESSION_ID}/contexts/context name",
            "lifespanCount": 5,
            "parameters": {
              "param": "param value"
            }
          }
        ],
        "followupEventInput": {
          "name": "event name",
          "languageCode": "en-US",
          "parameters": {
            "param": "param value"
          }
        }
      };



      let x = {
        payload: {
          google: {
            expectUserResponse: true,
            richResponse: {
              items: [
                {
                  simpleResponse: {
                    textToSpeech:
                      "Hang in there! Your " +
                      fooditem +
                      " from " +
                      restaurant +
                      " is on the way. "
                  }
                }
              ]
            }
          }
        }
      };

//      agent.add('Great. From Agent');
      res.json(respWithFulfil);
    })
    .catch(function(error) {
      console.log("error is: " + error);
      let x = {
        payload: {
          google: {
            expectUserResponse: true,
            richResponse: {
              items: [
                {
                  simpleResponse: {
                    textToSpeech:
                      "Hmmm... I feel a headache.. please try again after some time."
                  }
                }
              ]
            }
          }
        }
      };
      res.json(x);
    });
}

function getDateTime() {

  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  var sec = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  var year = date.getFullYear();

  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;

  var day = date.getDate();
  day = (day < 10 ? "0" : "") + day;

  return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}

// restService.post("/audio", function(req, res) {
//   var speech = "";
//   switch (req.body.result.parameters.AudioSample.toLowerCase()) {
//     //Speech Synthesis Markup Language
//     case "music one":
//       speech =
//         '<speak><audio src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio></speak>';
//       break;
//     case "music two":
//       speech =
//         '<speak><audio clipBegin="1s" clipEnd="3s" src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio></speak>';
//       break;
//     case "music three":
//       speech =
//         '<speak><audio repeatCount="2" soundLevel="-15db" src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio></speak>';
//       break;
//     case "music four":
//       speech =
//         '<speak><audio speed="200%" src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio></speak>';
//       break;
//     case "music five":
//       speech =
//         '<audio src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio>';
//       break;
//     case "delay":
//       speech =
//         '<speak>Let me take a break for 3 seconds. <break time="3s"/> I am back again.</speak>';
//       break;
//     //https://www.w3.org/TR/speech-synthesis/#S3.2.3
//     case "cardinal":
//       speech = '<speak><say-as interpret-as="cardinal">12345</say-as></speak>';
//       break;
//     case "ordinal":
//       speech =
//         '<speak>I stood <say-as interpret-as="ordinal">10</say-as> in the class exams.</speak>';
//       break;
//     case "characters":
//       speech =
//         '<speak>Hello is spelled as <say-as interpret-as="characters">Hello</say-as></speak>';
//       break;
//     case "fraction":
//       speech =
//         '<speak>Rather than saying 24+3/4, I should say <say-as interpret-as="fraction">24+3/4</say-as></speak>';
//       break;
//     case "bleep":
//       speech =
//         '<speak>I do not want to say <say-as interpret-as="bleep">F&%$#</say-as> word</speak>';
//       break;
//     case "unit":
//       speech =
//         '<speak>This road is <say-as interpret-as="unit">50 foot</say-as> wide</speak>';
//       break;
//     case "verbatim":
//       speech =
//         '<speak>You spell HELLO as <say-as interpret-as="verbatim">hello</say-as></speak>';
//       break;
//     case "date one":
//       speech =
//         '<speak>Today is <say-as interpret-as="date" format="yyyymmdd" detail="1">2017-12-16</say-as></speak>';
//       break;
//     case "date two":
//       speech =
//         '<speak>Today is <say-as interpret-as="date" format="dm" detail="1">16-12</say-as></speak>';
//       break;
//     case "date three":
//       speech =
//         '<speak>Today is <say-as interpret-as="date" format="dmy" detail="1">16-12-2017</say-as></speak>';
//       break;
//     case "time":
//       speech =
//         '<speak>It is <say-as interpret-as="time" format="hms12">2:30pm</say-as> now</speak>';
//       break;
//     case "telephone one":
//       speech =
//         '<speak><say-as interpret-as="telephone" format="91">09012345678</say-as> </speak>';
//       break;
//     case "telephone two":
//       speech =
//         '<speak><say-as interpret-as="telephone" format="1">(781) 771-7777</say-as> </speak>';
//       break;
//     // https://www.w3.org/TR/2005/NOTE-ssml-sayas-20050526/#S3.3
//     case "alternate":
//       speech =
//         '<speak>IPL stands for <sub alias="indian premier league">IPL</sub></speak>';
//       break;
//   }
//   return res.json({
//     speech: speech,
//     displayText: speech,
//     source: "webhook-echo-sample"
//   });
// });

// restService.post("/video", function(req, res) {
//   return res.json({
//     speech:
//       '<speak>  <audio src="https://www.youtube.com/watch?v=VX7SSnvpj-8">did not get your MP3 audio file</audio></speak>',
//     displayText:
//       '<speak>  <audio src="https://www.youtube.com/watch?v=VX7SSnvpj-8">did not get your MP3 audio file</audio></speak>',
//     source: "webhook-echo-sample"
//   });
// });

// restService.post("/slack-test", function(req, res) {
//   var slack_message = {
//     text: "Details of JIRA board for Browse and Commerce",
//     attachments: [
//       {
//         title: "JIRA Board",
//         title_link: "http://www.google.com",
//         color: "#36a64f",

//         fields: [
//           {
//             title: "Epic Count",
//             value: "50",
//             short: "false"
//           },
//           {
//             title: "Story Count",
//             value: "40",
//             short: "false"
//           }
//         ],

//         thumb_url:
//           "https://stiltsoft.com/blog/wp-content/uploads/2016/01/5.jira_.png"
//       },
//       {
//         title: "Story status count",
//         title_link: "http://www.google.com",
//         color: "#f49e42",

//         fields: [
//           {
//             title: "Not started",
//             value: "50",
//             short: "false"
//           },
//           {
//             title: "Development",
//             value: "40",
//             short: "false"
//           },
//           {
//             title: "Development",
//             value: "40",
//             short: "false"
//           },
//           {
//             title: "Development",
//             value: "40",
//             short: "false"
//           }
//         ]
//       }
//     ]
//   };
//   return res.json({
//     speech: "speech",
//     displayText: "speech",
//     source: "webhook-echo-sample",
//     data: {
//       slack: slack_message
//     }
//   });
// });

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
