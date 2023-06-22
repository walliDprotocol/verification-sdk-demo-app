<template>
  <v-container class="pt-16" style="max-width: 1200px">
    <v-row class="mt-12">
      <v-col cols="12" sm="6" md="3">
        <v-text-field
          v-model="NFT_ID"
          label="NFT_ID"
          class="centered-input"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <button
          class="btn mini login-btn v-btn v-btn--is-elevated v-size--default"
          @click="launchIframe"
          @mouseenter="itsHover = true"
          @mouseleave="itsHover = false"
        >
          Open Iframe
        </button>
      </v-col>
      <v-col cols="12" sm="6" md="3" class="d-flex flex-column">
        <button
          class="btn mini login-btn v-btn v-btn--is-elevated v-size--default"
          @click="verifySignature"
          @mouseenter="itsHover = true"
          @mouseleave="itsHover = false"
        >
          verifySignature
        </button>
        {{ resultTest }}
      </v-col>
      <v-col cols="12" sm="6" md="3" class="d-flex flex-column">
        <button
          class="btn mini login-btn v-btn v-btn--is-elevated v-size--default"
          @click="verifySignatureIframe"
          @mouseenter="itsHover = true"
          @mouseleave="itsHover = false"
        >
          verifySignatureIframe
        </button>
        {{ resultIframe }}
        <v-text-field
          v-model="twitterHandler"
          label="twitterHandler"
          class="centered-input"
        ></v-text-field>
        <v-text-field
          v-model="accountId"
          label="accountId"
          class="centered-input"
        ></v-text-field>
        <v-text-field
          v-model="NFT_ID"
          label="NFT_ID"
          class="centered-input"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8">
        <v-textarea :value="JSON.stringify(oauthData, null, 4)" auto-grow>
        </v-textarea>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { v4 as uuidv4 } from "uuid";

import PubNub from "pubnub";

var pubnub = new PubNub({
  userId: process.env.userId,
  subscribeKey: process.env.subscribeKey,
  publishKey: process.env.publishKey,
  // logVerbosity: true,
  ssl: true,
  presenceTimeout: 130,
});

const configUrl =
  process.env.BACKEND_URL + "api/v1/external/getNftInfo?nft_id=";
const localConfigUrl =
  "https://sdk-connector-api.herokuapp.com/api/v1/external/getNftInfo?nft_id=91881321";
const REQUEST_SEED_CHANNEL = "request_seed_";

import nacl from "tweetnacl";
import { decodeUTF8, decodeBase64 } from "tweetnacl-util";

import { sha256 } from "js-sha256";

export default {
  components: {},
  data() {
    return {
      IAID: "AE12345BA",
      IframeConfigId: "12312412412424534563",
      NFT_ID: "643963997c5c847a2c875841",
      oauthData: {},
      resultIframe: false,
      resultTest: false,
      twitterHandler: null,
      accountId: null,
    };
  },
  computed: {
    // ...mapState("connector", ["isWalletConnected", "account"]),
    getAccount() {
      return this.account
        ? this.$options.filters.truncate(this.account, 9)
        : this.btnText;
    },
  },
  mounted() {
    this.sessionID = uuidv4();
    console.log("Mounted method .... ", window.location.search);
    console.log("Session ID ", this.sessionID);
    pubnub.subscribe({
      channels: [
        "verification-iframe-" + this.sessionID,
        REQUEST_SEED_CHANNEL + this.sessionID,
      ],
    });

    pubnub.addListener({
      message: (receivedMessage) => {
        try {
          console.log("Sent to: ", receivedMessage.channel);

          if (
            receivedMessage.channel ==
            REQUEST_SEED_CHANNEL + this.sessionID
          ) {
            let payload = receivedMessage.message;
            let accountId = payload.accountId;

            //request backend using the account id in order to grab the seed associated with account id
            let seedFromBackend =
              "bridge soap black atom cabin glance math mask jaguar describe jungle feature";

            pubnub.publish(
              {
                message: { seedphrase: seedFromBackend },
                channel: REQUEST_SEED_CHANNEL + accountId + this.sessionID,
              },
              (status, response) => {
                // handle status, response
                console.log("status", status);
                console.log("response", response);
              }
            );
          } else {
            console.log("The message text is: ", receivedMessage.message);
            console.log("Sent by: ", receivedMessage.publisher);
            this.oauthData = receivedMessage?.message;
            this.showIframe = false;
          }
        } catch (error) {
          console.log("error", error);
        }
      },
    });
  },
  created() {
    // console.log('Window obj ', window )
  },
  methods: {
    verifyNACL() {
      let msgText = decodeUTF8("My unencrypted message");
      let pubKey = decodeBase64("tdERBKE7CwCA9Q7G97n8Qn49ce9PopddZSqnVp8yVwM=");
      let sig = decodeBase64(
        "IhSSC55PxGJdYs9ZwVcBzODzPS7cT+cZic2Z+4d11b4HTldtj8BH5MEqXo5athpUtjtnhYa4FtqbebBN4A3MBw=="
      );
      try {
        // var sig = nacl.sign.detached(msg, keys.secretKey);
        var result = nacl.sign.detached.verify(msgText, sig, pubKey);

        console.log(result);
      } catch (error) {
        console.error(error);
      }
    },
    verifySignatureIframe() {
      // order matters 🙂
      //build the signed data
      let data = {
        accountId: this.oauthData?.accountId,
        message: `${this.twitterHandler}:${this.accountId}:${this.NFT_ID}`,
        blockId: this.oauthData?.blockId,
        publicKey: this.oauthData?.publicKey,
        keyType: this.oauthData?.keyType,
      };
      try {
        const encoded = JSON.stringify(data);
        const message = new Uint8Array(sha256.array(decodeUTF8(encoded)));
        let pubKey = decodeBase64(this.oauthData?.publicKey);
        let sig = decodeBase64(this.oauthData?.signature);
        // var sig = nacl.sign.detached(msg, keys.secretKey);
        this.resultIframe = nacl.sign.detached.verify(message, sig, pubKey);

        console.log(this.resultIframe);
      } catch (error) {
        console.error(error);
      }
    },
    verifySignature() {
      // order matters 🙂
      let data = {
        accountId: "guilherme-testnet.testnet",
        message: "sign data",
        blockId: "GnD3go2gy7xcbqcmidbKZ1EZ2WBFBEhGzN51gjn67W7c",
        publicKey: "QWwuMAlR+nCajPiAQ9TmX9j4L10Xn1zC5TbVY7bjvbg=",
        keyType: 0,
      };
      const encoded = JSON.stringify(data);
      const message = new Uint8Array(sha256.array(decodeUTF8(encoded)));
      let pubKey = decodeBase64("QWwuMAlR+nCajPiAQ9TmX9j4L10Xn1zC5TbVY7bjvbg=");
      let sig = decodeBase64(
        "bDfUXCY31ReF5bngQEolF9PE2sW3LD0LE5p50XqdJAMF2k6WB5K3zzzEWQpA1uSyfF5+dIbWpqk1tHOC5aI8AA=="
      );
      try {
        // var sig = nacl.sign.detached(msg, keys.secretKey);
        this.resultTest = nacl.sign.detached.verify(message, sig, pubKey);

        console.log(this.resultTest);
      } catch (error) {
        console.error(error);
      }
    },
    launchIframe() {
      console.log("**** Iframe should lauch in secs ");

      let urlParams = new URLSearchParams(window.location.search);
      let nftId = urlParams.get("nft_id") || this.NFT_ID;

      this.iframeUrlSessionId =
        // "http://localhost:8080/royalties" +
        "https://sdk-iframe.herokuapp.com/royalties" +
        "?uuid=" +
        this.sessionID +
        `&nft=${nftId}`;

      const popup = window.open(
        this.iframeUrlSessionId,
        // "http://localhost:8080",
        "popup",
        "width=900,height=640,toolbar=no,menubar=no"
      );
      //  axios
      // .get(localConfigUrl)
      // .then(function (response) {
      //   console.log("Getting data about nft ", response.data);
      // })
      // .catch(function (error) {
      //   console.log("Getting data : ", error);
      // });
    },

    async todo() {
      // 'https://cdn.discordapp.com/avatars/{user_id}/{user_avatar}.png'
    },
  },
};
</script>
<style>
.login-btn {
  max-width: 240px;
}
</style>
