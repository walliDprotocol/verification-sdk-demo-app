<template>
  <v-container class="wallidao pt-16">
    <Profile></Profile>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import nuxtStorage from "nuxt-storage";
import Iframe from "@/components/Iframe";

console.log("BACKEND URL ", process.env.BACKEND_URL);

const TWITTER_LOGIN =
  process.env.BACKEND_URL + "/api/v1/redirect/login/twitter";
const TWITTER_INFO = process.env.BACKEND_URL + "/api/v1/redirect/twitter";

const DISCORD_AUTH = process.env.DISCORD_AUTH;
const DISCORD_AUTH_BACKEND =
  process.env.BACKEND_URL + "/api/v1/redirect/authcode/discord";
const GET_GUILDS = "https://discord.com/api/users/@me/guilds";

const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;
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
      dialog: false,
      connectLoader: false,
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
    console.log("Mounted method .... ", window.location.search);
    console.log("Session ID ", this.sessionID);
    nuxtStorage.localStorage.setData("sessionId", {
      sessionId: this.sessionID,
    });

    let urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams.has("oauth_token")); // true
    console.log(urlParams.has("oauth_verifier")); // true
  },
  created() {
    // console.log('Window obj ', window )
  },
  methods: {
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
<style>
.wallidao {
  width: 100vw;
  max-width: unset;
  height: 100vh;
  background: url("@/assets/background.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  overflow: auto;
}
</style>
