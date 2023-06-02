<template>
  <v-container>
    <v-row justify="center" align="center">
      <!-- <Iframe v-if="showIframe" :iframeUrl="iframeUrlSessionId"> </Iframe> -->

      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Mintabase Webapp
          </v-card-title>
          <v-divider></v-divider>

          <h3>Thanks for your participation</h3>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false"> OK </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-col cols="12" sm="8" md="8" class="text-center">
        <button
          class="btn mini login-btn v-btn v-btn--is-elevated v-size--default"
          :class="{ load: connectLoader }"
          @click="openWalliDIframe"
          @mouseenter="itsHover = true"
          @mouseleave="itsHover = false"
        >
          WalliD Connector
        </button>
      </v-col>
      <v-col cols="8">
        <v-textarea :value="JSON.stringify(oauthData, null, 4)" auto-grow>
        </v-textarea>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import nuxtStorage from "nuxt-storage";
import Iframe from "@/components/Iframe";
import PubNub from "pubnub";
import { v4 as uuidv4 } from "uuid";

var pubnub = new PubNub({
  userId: "verification-sdk-iframe",
  subscribeKey: "sub-c-b36746ec-a4bf-11ec-8a23-de1bbb7835db",
  publishKey: "pub-c-db6abb24-ed6e-41a2-b2f2-2322e2dcf786",
  logVerbosity: true,
  ssl: true,
  presenceTimeout: 130,
});

console.log("BACKEND URL ", process.env.BACKEND_URL);

const IFRAME_URL = process.env.IFRAME_URL;
const TWITTER_LOGIN =
  process.env.BACKEND_URL + "/api/v1/redirect/login/twitter";
const TWITTER_INFO = process.env.BACKEND_URL + "/api/v1/redirect/twitter";

const DISCORD_AUTH = process.env.DISCORD_AUTH;
const DISCORD_AUTH_BACKEND =
  process.env.BACKEND_URL + "/api/v1/redirect/authcode/discord";
const GET_GUILDS = "https://discord.com/api/users/@me/guilds";

const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;
const TWITTER_ACCOUNT_ID = process.env.TWITTER_ACCOUNT_ID;
const TWITTER_POST_ID = process.env.TWITTER_POST_ID || "1499189957717463043";
const TWITTER_ACCOUNT = process.env.TWITTER_ACCOUNT;

export default {
  components: {
    Iframe,
  },
  data() {
    return {
      oauthData: { facebook: {}, linkedin: {} },
      sessionID: 0,
      showIframe: false,
      itsHover: false,
      dialog: false,
      connectLoader: false,
      twitter_account_username: TWITTER_ACCOUNT,
      discord_server_id: DISCORD_GUILD_ID,
      redirect_url: "",
      btnText: "Connect",

      u_twitter_acodes: "",
      u_twitter: "",
      isTwitterConnect: false,

      discord_auth: "",
      u_discord: "",
      isDiscordConnect: false,
      info: "",
      walletConnect: {
        type: "WALLET_CONNECT",
        task: "Connect your metamask wallet",
        complete: this.isWalletConnected,
        icon: "mdi-check-circle-outline",
        class: "",
      },
      discordLoginTask: {
        type: "DISCORD_LOGIN",
        task: "Connect with Discord account",
        complete: false,
        icon: "mdi-discord",
        class: "",
      },
      twitterLoginTask: {
        type: "TWITTER_LOGIN",
        task: "Connect with twitter account",
        complete: false,
        icon: "mdi-twitter",
        class: "",
      },
      twitterFollowAccount: {
        type: "TWITTER_FOLLOW_ACCOUNT",
        task: "Follow " + TWITTER_ACCOUNT + " account on twitter",
        complete: false,
        icon: "mdi-check-circle-outline",
        class: "",
      },
      twitterRetweet: {
        type: "TWITTER_RETWEET",
        task: "Retweet $POST post on twitter ",
        complete: false,
        icon: "mdi-check-circle-outline",
        class: "",
      },
      discordGuild: {
        type: "DISCORD_ON_GUILD",
        task: "Belong to $CHANNEL on Discord",
        complete: false,
        icon: "mdi-check-circle-outline",
        class: "",
      },
    };
  },
  computed: {
    ...mapState("connector", ["isWalletConnected", "account"]),
    getAccount() {
      return this.account
        ? this.$options.filters.truncate(this.account, 9)
        : this.btnText;
    },
  },
  mounted() {
    let self = this;
    this.sessionID = uuidv4();
    console.log("Mounted method .... ", window.location.search);
    console.log("Session ID ", this.sessionID);
    nuxtStorage.localStorage.setData("sessionId", {
      sessionId: this.sessionID,
    });

    console.log("IFRAME_URL : ", IFRAME_URL);
    console.log("BENFAS : ", process.env.BENFAS);

    let urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams.has("oauth_token")); // true
    console.log(urlParams.has("oauth_verifier")); // true

    pubnub.subscribe({ channels: ["verification-iframe-" + this.sessionID] });

    pubnub.addListener({
      message: (receivedMessage) => {
        // handle message
        console.log("The message text is: ", receivedMessage.message);
        console.log("Sent by: ", receivedMessage.publisher);
        this.oauthData = receivedMessage.message;
        this.showIframe = false;
      },
    });
  },
  created() {
    // console.log('Window obj ', window )
  },
  methods: {
    openWalliDIframe() {
      // this.showIframe = true;
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
    },
    checkApplyButtonStatus() {
      let checkStatus = false;

      console.log("Apply status : ", checkStatus);
      // console.log(' login twiiter : ', this.twitterLoginTask );
      // console.log(' twitterFollowAccount : ', this.twitterFollowAccount );
      // console.log(' twitterRetweet : ', this.twitterRetweet );
      // console.log(' discordLoginTask : ', this.discordLoginTask );
      //  console.log(' discordGuild : ', this.discordGuild );
      return checkStatus;
    },
    verifyGuildOnDiscord() {
      console.log("****** verifyGuildOnDiscord **********");
      let self = this;

      if (nuxtStorage.localStorage.getData("discord_auth")) {
        let auth = nuxtStorage.localStorage.getData("discord_auth");
        const headers = {
          Authorization: auth.token_type + " " + auth.access_token,
        };

        console.log("Authorization ", headers);
        axios
          .get(GET_GUILDS, { headers: headers })
          .then(function (response) {
            console.log("Response frmo guild ", response.data);
            let guild = response.data.filter((item, i) => {
              return item.id === DISCORD_GUILD_ID;
            });

            if (guild && guild.length > 0) {
              console.log("User is a member of that guild ");
              self.u_discord.guild = guild;
              self.discordGuild.complete = true;
              self.discordGuild.class = "text-decoration-line-through";
              return true;
            } else {
              console.log("User is NOT a member of that guild ");
              return false;
            }
          })
          .catch(function (error) {
            return false;
          });
      } else {
        return false;
      }
    },

    async checkUserRetweet(accessToken, userId) {
      console.log("************ checkUserRetweet ************");
      if (!accessToken || !userId) {
        console.log("No accessToken or userId");
        return;
      }

      let self = this;
      let headers = {
        "Content-Type": "application/json",
      };
      const BACKEND_URL =
        process.env.BACKEND_URL + "/api/v1/social/twitter/retweet";
      axios
        .post(
          BACKEND_URL,
          {
            accesstoken: accessToken,
            userid: userId,
          },
          { headers: headers }
        )
        .then((response) => {
          console.log("checkUserRetweet: ", response.data);
          if (response.data) {
            if (
              response.data.data.retweetUser &&
              response.data.data.retweetUser.length > 0
            ) {
              console.log("Retweet user -> IS RETWEET");
              self.twitterRetweet.class = "text-decoration-line-through";
              self.twitterRetweet.complete = true;
            } else {
              self.twitterRetweet.class = "";
              self.twitterRetweet.complete = false;
            }
          }
        })
        .catch((error) => {
          console.log("error FOLLOW TWITTER ACCOUNT: ", error);
          this.errored = true;
        })
        .finally(() => console.log("finally"));
    },
    async checkIfFollowTwitterAccount(accessToken, userId) {
      console.log("************ checkIfFollowTwitterAccount ************");
      if (!accessToken || !userId) {
        console.log("No accessToken or userId");
        return;
      }

      let self = this;
      let headers = {
        "Content-Type": "application/json",
      };
      const BACKEND_URL =
        process.env.BACKEND_URL + "/api/v1/social/twitter/follow";
      axios
        .post(
          BACKEND_URL,
          {
            accesstoken: accessToken,
            userid: userId,
          },
          { headers: headers }
        )
        .then((response) => {
          console.log("FOLLOW TWITTER ACCOUNT: ", response.data);
          if (response.data) {
            if (
              response.data.data.followAccount &&
              response.data.data.followAccount.length > 0
            ) {
              console.log("Retweet user -> IS FOLLOW");
              self.twitterFollowAccount.class = "text-decoration-line-through";
              self.twitterFollowAccount.complete = true;
            } else {
              self.twitterFollowAccount.class = "";
              self.twitterFollowAccount.complete = false;
            }
          }
        })
        .catch((error) => {
          console.log("error FOLLOW TWITTER ACCOUNT: ", error);
          this.errored = true;
        })
        .finally(() => console.log("finally"));
    },

    async getTwitterUsername(state, code, codeVerifier) {
      console.log("|***** Get twitter username *****  ");

      let self = this;

      axios
        .post(TWITTER_INFO, {
          state: state,
          code: code,
          codeVerifier: codeVerifier,
        })
        .then(function (response) {
          console.log("response from twitter login: ", response.data);

          self.u_twitter = {
            username: response.data.username,
            name: response.data.name,
            id: response.data.id,
          };

          self.u_twitter_acodes = {
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          };

          nuxtStorage.localStorage.setData("twitter_user", {
            user: self.u_twitter,
            authCodes: self.u_twitter_acodes,
          });

          self.isTwitterConnect = true;
          self.twitterLoginTask.class = "text-decoration-line-through";
          self.twitterLoginTask = true;
          window.location.href = "/";
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    async twitterConnect() {
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,DELETE",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested With, Content-Type, Accept",
      };
      let self = this;
      // console.log('Twitter connect ', axios)
      axios
        .get(TWITTER_LOGIN, { headers: headers })
        .then((response) => {
          console.log("get from axios ", response.data);
          if (response.data && response.data.redirect) {
            self.twitter_preAuth = response.data;
            nuxtStorage.localStorage.setData("twitter_preAuth", response.data);

            console.log(
              "get data ",
              nuxtStorage.localStorage.getData("twitter_preAuth")
            );

            window.location = response.data.redirect;

            // window.open(response.data.redirect, '_blank');
            // win
            //  this.redirect_url = response.data.redirect;
            //  this.dialog=true;
          }
        })
        .catch((error) => {
          console.log("error twitter login: ", error);
          this.errored = true;
        })
        .finally(() => (this.loading = false));
    },
    async discordConnect() {
      console.log("Dicord connect ..... ");
      window.location = DISCORD_AUTH;
    },
    async getDiscordAuth(code) {
      console.log("***********  getDiscordAuth **************** ", code);

      let self = this;

      axios
        .post(DISCORD_AUTH_BACKEND, {
          code: code,
        })
        .then(function (response) {
          console.log("response from discord auth ", response.data);
          nuxtStorage.localStorage.setData("discord_auth", response.data);
          self.getDiscordUserInfo(response.data);
        })
        .catch(function (error) {
          console.log("error: ", error);
        });
    },
    async getDiscordUserInfo(auth) {
      console.log("***********  getDiscordUserInfo **************** ", auth);
      let self = this;
      const GET_USER_DISCORD = "https://discord.com/api/users/@me";
      const headers = {
        Authorization: auth.token_type + " " + auth.access_token,
      };

      axios
        .get(GET_USER_DISCORD, { headers: headers })
        .then(function (response) {
          console.log("response from discord user ", response.data);
          nuxtStorage.localStorage.setData("discord_user", response.data);
          self.u_discord = response.data;
          self.discordLoginTask.complete = true;
          self.discordLoginTask.class = "text-decoration-line-through";
          self.isDiscordConnect = true;
          window.location.href = "/";
        })
        .catch(function (error) {
          console.log("error: ", error);
        });
    },
    async getDiscordAvatar() {
      // 'https://cdn.discordapp.com/avatars/{user_id}/{user_avatar}.png'
    },
  },
}; //export body
</script>
