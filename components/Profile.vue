<template>
  <v-container class="profile" style="max-width: 1200px">
    <v-row class="pt-16" justify="center" align="center">
      <v-col>
        <h1>Your profile</h1>
      </v-col>
      <v-col class="" justify="center" align="right">
        <div
          title="Logout"
          @click="resetCache()"
          class="connected-wallet d-flex"
        >
          <span style="font-size: 8px; margin-top: 4px; margin-right: 2px">
            🟢
          </span>
          <h4>
            {{ walletAddress }}
          </h4>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="" align="center">
        <v-card class="card-bg">
          <v-img
            class="mb-3"
            contain
            :max-width="160"
            :src="require('@/assets/avatar.png')"
          ></v-img>
          <h2 class="mb-3">Georgeb</h2>
          <h5>{{ walletAddress }}</h5>
        </v-card>
      </v-col>

      <v-col cols="12" sm="8" md="8" justify="center" align="center">
        <v-card class="card-bg">
          <v-container class="pa-0 py-8">
            <v-row class="" align="center">
              <v-col cols="auto" class="text-center">
                <v-sheet
                  style="height: 200px; min-width: 220px"
                  class="text-left pl-4 pr-0"
                >
                  <h4 class="mb-4">My trust score</h4>
                  <p class="trust-score">{{ currentTrustScore }}%</p>
                  <div class="progress-bar">
                    <v-img
                      height="11"
                      :max-width="`${currentTrustScore}%`"
                      :src="require('@/assets/progress-bar.svg')"
                    >
                    </v-img>
                  </div>
                </v-sheet>
              </v-col>
              <v-col cols="7">
                <v-sheet style="height: 200px" class="text-left">
                  <v-row>
                    <v-col>
                      <h4>Verify your ID to increase your Trust score</h4>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="auto"
                      v-for="{ name, verified } in socialIds"
                      :key="name"
                      style="position: relative"
                    >
                      <v-img
                        v-if="verified"
                        class="verified-check"
                        contain
                        width="20"
                        :src="require(`@/assets/check.svg`)"
                      ></v-img>
                      <v-img
                        :style="[verified ? { opacity: 1 } : { opacity: 0.28 }]"
                        width="52"
                        :src="require(`@/assets/${name}.webp`)"
                      ></v-img>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-btn class="advance-btn" @click="openWalliDIframe">
                        Increase your trust score
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-sheet>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { Verifier } from "@/plugins/verification-sdk.js";

const DEFAULT_SOCIAL_IDS = {
  nearTokens: { name: "nearTokens", verified: false },
  twitter: { name: "twitter", verified: false },
  google: { name: "google", verified: false },
  github: { name: "github", verified: false },
};

export default {
  components: {},
  mounted() {
    this.verifier = new Verifier();

    this.verifier.addListener({
      message: (receivedMessage) => {
        // handle message
        console.log("The message text is: ", receivedMessage.message);
        console.log("Sent by: ", receivedMessage.publisher);
        this.handleOauthData(receivedMessage.message);
      },
    });

    this.loadOauthStorage();

    this.handleOauthData({});
  },
  data() {
    return {
      walletAddress: "0x707…dAa8",
      currentTrustScore: 0,
      socialIds: DEFAULT_SOCIAL_IDS,
      oauthData: {},
    };
  },
  methods: {
    resetCache() {
      sessionStorage.removeItem("socialIds");
      this.socialIds = DEFAULT_SOCIAL_IDS;
      this.handleOauthData({});
    },
    loadOauthStorage() {
      this.socialIds = JSON.parse(
        sessionStorage.getItem("socialIds") || JSON.stringify(this.socialIds)
      );
    },
    handleOauthData(oauthData) {
      Object.keys(oauthData).forEach((socialId) => {
        if (
          socialId in this.socialIds &&
          Object.keys(oauthData[socialId]).length > 0
        )
          this.$set(this.socialIds, socialId, {
            ...this.socialIds[socialId],
            verified: true,
          });
      });
      sessionStorage.setItem("socialIds", JSON.stringify(this.socialIds));
      this.increaseTrustScore();
    },

    async increaseTrustScore() {
      const totalEntries = Object.keys(this.socialIds).length;
      let verifiedEntries = 0;

      // Iterate through each entry and count the verified ones
      for (let key in this.socialIds) {
        if (this.socialIds[key].verified) {
          verifiedEntries++;
        }
      }
      console.log("verifiedEntries", verifiedEntries);

      const percentage = (verifiedEntries / totalEntries) * 100;
      const interval = setInterval(() => {
        this.currentTrustScore = parseInt(this.currentTrustScore);
        this.currentTrustScore += verifiedEntries;

        if (this.currentTrustScore >= percentage.toFixed(0)) {
          clearInterval(interval);
          this.currentTrustScore = percentage.toFixed(0);
        }
      }, (1 - Math.pow(percentage / 300, 2)) * 100);
    },
    openWalliDIframe() {
      // this.showIframe = true;

      const params = { configId: "64775dbe48818915e2a8bda3", what: "1233" };

      this.verifier.launchVerificationIframe(params);
    },
  },
};
</script>

<style lang="scss">
.profile {
  .verified-check {
    position: absolute;
    z-index: 2;
    right: 6px;
  }
  .connected-wallet {
    border-radius: 19px;
    background-color: #d8d8d844;
    padding: 6px 10px;
    width: fit-content;
    cursor: pointer;
  }
  .progress-bar {
    background-color: white;
    border-radius: 10px;
    .v-image {
      transition: max-width 200ms ease-in-out;
      border-radius: 10px;
    }
  }
  .v-sheet {
    background-color: transparent;
    box-shadow: none;
    padding-left: 50px;
    padding-right: 50px;
  }
  .card-bg {
    padding: 34px 24px;
    border-radius: 24px;
    background-color: #80809742;
    min-height: 330px;

    .row .col:nth-child(2) {
      .v-sheet {
        border-left: solid 1px #01022e;
      }
    }
  }
  .advance-btn {
    .v-btn__content {
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #01022e;
      text-transform: none;
    }

    & {
      border-radius: 10px;
      background-image: linear-gradient(
        to left,
        #7acefd 25%,
        #73dde7 50%,
        #64ffde 75%
      );
    }
  }
  p.trust-score {
    font-size: 76px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #fff;
  }
  h1 {
    font-size: 50px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #fff;
  }
  h4 {
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #fff;
  }

  h5 {
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #fff;
  }
}
</style>
