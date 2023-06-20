<template>
  <v-container class="profile" style="max-width: 1200px">
    <v-row class="pt-16" justify="center" align="center">
      <v-col>
        <h1>Your profile</h1>
      </v-col>
      <v-col class="" justify="center" align="right">
        <div class="connected-wallet d-flex">
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
              <v-col cols="4" class="text-center">
                <v-sheet style="height: 200px" class="text-left">
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
              <v-col cols="8">
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
                      :key="socialId"
                    >
                      <v-img
                        v-if="verified"
                        :src="require(`@/assets/check.svg`)"
                      ></v-img>
                      <v-img
                        width="52"
                        :src="require(`@/assets/${name}.webp`)"
                      ></v-img>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-btn
                        class="advance-btn"
                        :class="{ load: connectLoader }"
                        @click="openWalliDIframe"
                      >
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

export default {
  components: {},
  mounted() {
    this.verifier = new Verifier();

    this.verifier.addListener({
      message: (receivedMessage) => {
        // handle message
        console.log("The message text is: ", receivedMessage.message);
        console.log("Sent by: ", receivedMessage.publisher);
        this.oauthData = receivedMessage.message;
      },
    });
  },
  data() {
    return {
      walletAddress: "0x707…dAa8",
      currentTrustScore: 0,
      socialIds: [
        { name: "near" },
        { name: "twitter" },
        { name: "google" },
        { name: "github" },
      ],
    };
  },
  methods: {
    increaseTrustScore() {},
    openWalliDIframe() {
      // this.showIframe = true;

      this.verifier.launchVerificationIframe();
    },
  },
};
</script>

<style lang="scss">
.profile {
  .connected-wallet {
    border-radius: 19px;
    background-color: #d8d8d844;
    padding: 6px 10px;
    width: fit-content;
  }
  .progress-bar {
    background-color: white;
    border-radius: 10px;
    .v-image {
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
