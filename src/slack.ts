import { Block, KnownBlock, MessageAttachment } from "@slack/types";
import {
  IncomingWebhook,
  IncomingWebhookResult,
  IncomingWebhookSendArguments,
} from "@slack/webhook";

type Header = "Deploy succeeded" | "Deploy failed";

interface SlackAcceptable {
  commit: string;
  commitUrl: string;
  result: boolean;
  deployId: string;
  deployUrl: string;
}

export class Slack extends IncomingWebhook {
  private readonly headerText: { [key: string]: Header } = {
    success: "Deploy succeeded",
    failure: "Deploy failed",
  };
  private readonly color = { success: "#2cbe4e", failure: "#cb2431" };
  private header: Header;
  private target: SlackAcceptable;
  constructor(
    target: SlackAcceptable,
    url: string = process.env.SLACK_WEBHOOK_URL || "",
    channel: string = "#notification"
  ) {
    super(url, { channel });
    this.target = target;
    this.header = target.result
      ? this.headerText.success
      : this.headerText.failure;
  }

  private generateBlocks(): (Block | KnownBlock)[] {
    return [
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Deploy*\n<${this.target.deployUrl}|${this.target.deployId}>`,
          },
          {
            type: "mrkdwn",
            text: `*Commit*\n<${this.target.commitUrl}|${this.target.commit}>`,
          },
        ],
      },
    ];
  }

  private generateAttachment(
    blocks: (Block | KnownBlock)[]
  ): MessageAttachment {
    return {
      blocks,
      color: this.target.result ? this.color.success : this.color.failure,
    };
  }

  private generatePayload(
    attachments?: MessageAttachment[],
    blocks?: (Block | KnownBlock)[]
  ): IncomingWebhookSendArguments {
    const payload: IncomingWebhookSendArguments = {
      blocks,
      attachments,
      text: this.header,
    };
    return payload;
  }

  public async notify(): Promise<IncomingWebhookResult> {
    try {
      const blocks = this.generateBlocks();
      const attachment = this.generateAttachment(blocks);
      const payload = this.generatePayload([attachment]);
      const result = await this.send(payload);
      return result;
    } catch (err) {
      console.log(`ERROR: ${err}`);
      throw err;
    }
  }
}
