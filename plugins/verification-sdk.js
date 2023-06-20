// requires pubnub to be set up first
import { v4 as uuidv4 } from "uuid";
import PubNub from "pubnub";

const IFRAME_URL = "http://localhost:8080"; // process.env.IFRAME_URL;

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

  launchVerificationIframe(params) {
    const iframeUrl = new URL(IFRAME_URL);
    iframeUrl.searchParams.set("uuid", this.sessionID);
    iframeUrl.searchParams.set("flow", "celo");
    iframeUrl.searchParams.set("configId", "64775dbe48818915e2a8bda3");
    window.open(
      iframeUrl,
      // "http://localhost:8080",
      "popup",
      "width=900,height=640,toolbar=no,menubar=no"
    );
  }
}
