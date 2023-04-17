<template>
 <v-container>
    <v-row></v-row>
   

  <v-row>
  <v-col cols="12" sm="6" md="3">
    <v-text-field  v-model="nft_title" label="NFT Title" class="centered-input"></v-text-field>
    </v-col>
</v-row>
<v-row>
  <v-col cols="12" sm="6" md="3">
    <v-text-field  v-model="nft_description" label="NFT Description" class="centered-input"></v-text-field>
    </v-col>
</v-row>
<v-row>
  <v-col cols="10" sm="10" md="3">
    <v-text-field v-model="holder1" label="Twitter Username" class="centered-input"></v-text-field>
    </v-col>
    <v-col cols="2" sm="2" md="3">
    <v-text-field v-model="holder1Perc" label="Hodling %" class="centered-input"></v-text-field>
    </v-col>
</v-row>
<v-row>
  <v-col cols="10" sm="10" md="3">
    <v-text-field  v-model="holder2" label="Twitter Username" class="centered-input"></v-text-field>
    </v-col>
    <v-col cols="2" sm="2" md="3">
    <v-text-field v-model="holder2Perc" label="Hodling %" class="centered-input"></v-text-field>
    </v-col>
</v-row>
<v-row>
  <v-col cols="12" sm="8" md="8" class="text-center">
        <button
          class="btn mini login-btn v-btn v-btn--is-elevated v-size--default"
          :class="{ load: connectLoader }"
          @click="openWalliDIframe"
          @mouseenter="itsHover = true"
          @mouseleave="itsHover = false"
        >
          Mint
        </button>
      </v-col>
</v-row>

  
  </v-container>
 
</template>
<script>
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
 

export default {
  components: {
    
  },
  data() {
    return {
      nft_title : "Golden Hammer",
      nft_description: "",
      holder1  : "@masterviana",
      holder1Perc : "90",
      holder2  : "@fveiga",
      holder2Perc : "10",
      sessionID: 0
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
    let self = this;
    this.sessionID = uuidv4();
    console.log("Mounted method .... ", window.location.search);
  
  },
  created() {
    // console.log('Window obj ', window )
  },
  methods: {
    mintNft() {
      console.log("mint nft : ");
     
    },
   
    async todo() {
      // 'https://cdn.discordapp.com/avatars/{user_id}/{user_avatar}.png'
    },
  }
};

</script>
