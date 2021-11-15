interface NetlifyEvent {
  body: string | null;
}

type NetlifyEventBody = {
  title: string;
  state: string;
  commit_url: string;
  admin_url: string;
  id: string;
};

export class Netlify {
  private readonly interfix = "/deploys/";
  private readonly success = "ready";
  private readonly _commit?: string;
  private readonly _commitUrl?: string;
  private readonly _result?: boolean;
  private readonly _deployId?: string;
  private readonly _deployUrl?: string;

  constructor(event: NetlifyEvent) {
    if (event.body == null) {
      console.log("Request body is empty...");
      return;
    }
    const body = this.parseEventBody(event.body);
    this._commit = this.stripTitle(body["title"]);
    this._commitUrl = body["commit_url"];
    this._result = body["state"] === this.success;
    this._deployId = body["id"];
    this._deployUrl = `${body["admin_url"]}${this.interfix}${body["id"]}`;
  }

  get commit() {
    return this._commit;
  }

  get commitUrl() {
    return this._commitUrl;
  }

  get result() {
    return this._result;
  }

  get deployId() {
    return this._deployId;
  }

  get deployUrl() {
    return this._deployUrl;
  }

  private parseEventBody = (body: string): NetlifyEventBody => {
    try {
      const json: NetlifyEventBody = JSON.parse(body);
      return json;
    } catch (err) {
      console.log(`ERROR: ${err}`);
      throw err;
    }
  };

  // Netlifyのbody内のtitleから余分な改行を除く
  private stripTitle = (title: string): string => title.split("\n")[0];
}
