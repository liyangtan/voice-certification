const app = require("express")();
const bodyParser = require("body-parser");
const origin_phone_number = ""; //<ENTER VIRTUAL NUMBER> that you are calling;
const agent_office_number = ""; //<ENTER VIRTUAL NUMBER>;
const base_url = ""; //<ENTER NGROK URL>;
var moment = require("moment");

app.use(bodyParser.json());

const onInboundCall = (request, response) => {
  const ncco = [
    {
      action: "talk",
      text:
        "Hello, welcome to Voice Certification Test System. To listen to an audio file press 1. To get current time and date press 2. For an agent, press 3",
      bargeIn: true,
    },
    {
      action: "input",
      eventUrl: [`${base_url}/webhooks/dtmf`],
      maxDigits: 1,
    },
  ];

  response.json(ncco);
};

const onInput = (request, response) => {
  console.log(request.body.dtmf);
  const dtmf = request.body.dtmf;
  var ncco;

  switch (dtmf) {
    case "1":
      ncco = [
        {
          action: "talk",
          text: "You are listening to an audio file",
        },
        {
          action: "stream",
          streamUrl: ["https://www.computerhope.com/jargon/m/example.mp3"],
        },
      ];
      response.json(ncco);
      break;
    case "2":
      console.log(moment().format("LLLL"));
      ncco = [
        {
          action: "talk",
          text: `The current time and date is ${moment().format("LLLL")}`,
        },
      ];
      response.json(ncco);
      break;
    case "3":
      ncco = [
        {
          action: "talk",
          text: `You have asked to speak with an agent, Connecting you now.`,
        },
        {
          action: "connect",
          from: origin_phone_number,
          endpoint: [
            {
              type: "phone",
              number: agent_office_number,
            },
          ],
        },
      ];
      response.json(ncco);
      break;
    default:
      ncco = [
        {
          action: "talk",
          text:
            "I'm sorry I didn't understand what you entered please try again",
        },
      ];
      response.json(ncco);
      break;
  }
};

const onEvent = (request, response) => {
  response.status(200).send();
};
app
  .get("/webhooks/answer", onInboundCall)
  .post("/webhooks/dtmf", onInput)
  .post("/webhooks/events", onEvent);

app.listen(3000);
