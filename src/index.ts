import { APIGatewayEvent } from "aws-lambda";
import { Netlify } from "./netlify";
import { Slack } from "./slack";

export const lambdaHandler = async (event: APIGatewayEvent) => {
  const netlify = new Netlify(event);
  if (
    netlify.commit == null ||
    netlify.commitUrl == null ||
    netlify.result == null ||
    netlify.deployId == null ||
    netlify.deployUrl == null
  ) {
    try {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Cannot parse the event message...",
        }),
      };
    } catch (err) {
      console.log(`ERROR: ${err}`);
      return err;
    }
  }

  const slack = new Slack({
    commit: netlify.commit,
    commitUrl: netlify.commitUrl,
    result: netlify.result,
    deployId: netlify.deployId,
    deployUrl: netlify.deployUrl,
  });

  const result = await slack.notify();
  if (result.text !== "ok") {
    try {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Cannot notify to slack...",
        }),
      };
    } catch (err) {
      console.log(`ERROR: ${err}`);
      return err;
    }
  }

  try {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Slack notification finished." }),
    };
  } catch (err) {
    console.log(err);
    return err;
  }
};
