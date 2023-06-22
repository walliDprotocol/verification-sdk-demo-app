// requires pubnub to be set up first
import { v4 as uuidv4 } from "uuid";
import PubNub from "pubnub";

const IFRAME_URL = process.env.IFRAME_URL; // "http://localhost:8080";

export class Verifier {
  sessionID;
  pubnub;
  constructor() {
    this.sessionID = uuidv4();
    this.initPubNub();
  }

  initPubNub() {
    this.pubnub = new PubNub({
      userId: "verification-sdk-iframe",
      subscribeKey: "sub-c-b36746ec-a4bf-11ec-8a23-de1bbb7835db",
      publishKey: "pub-c-db6abb24-ed6e-41a2-b2f2-2322e2dcf786",
      ssl: true,
      presenceTimeout: 130,
    });
    this.pubnub.subscribe({
      channels: ["verification-iframe-" + this.sessionID],
    });
  }

  addListener(listener) {
    this.pubnub.addListener(listener);
  }

  createSearchParams(params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, values]) => {
      if (Array.isArray(values)) {
        values.forEach((value) => {
          searchParams.append(key, value);
        });
      } else {
        searchParams.append(key, values);
      }
    });
    return searchParams;
  }

  launchVerificationIframe(params) {
    const iframeUrl = new URL(IFRAME_URL);

    const searchParams = this.createSearchParams(params);
    iframeUrl.search = searchParams;
    iframeUrl.searchParams.set("uuid", this.sessionID);
    window.open(
      iframeUrl,
      // "http://localhost:8080",
      "popup",
      "width=900,height=640,toolbar=no,menubar=no"
    );
  }
}
