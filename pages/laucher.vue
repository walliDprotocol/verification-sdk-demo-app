<template>
    <v-container>
       <v-row></v-row>
      
   
     <v-row>
     <v-col cols="12" sm="6" md="3">
       <h4>Iframe will be launched in 5s</h4>
       </v-col>
   </v-row>
   <v-row>
     <v-col cols="12" sm="6" md="3">
       <v-text-field  v-model="NFT_ID" label="NFT_ID" class="centered-input"></v-text-field>
       </v-col>
   </v-row>
   <v-row>
     <v-col cols="12" sm="6" md="3">
        <button
          class="btn mini login-btn v-btn v-btn--is-elevated v-size--default"
          :class="{ load: connectLoader }"
          @click="launchIframe"
          @mouseenter="itsHover = true"
          @mouseleave="itsHover = false"
        >
         Open Iframe
        </button>
       </v-col>
   </v-row>
  
   
     
    </v-container>
    
   </template>
   <script>
   import axios from "axios";
   import { v4 as uuidv4 } from "uuid";

   const configUrl = process.env.BACKEND_URL + "api/v1/external/getNftInfo?nft_id=";
   const localConfigUrl = "https://sdk-connector-api.herokuapp.com/api/v1/external/getNftInfo?nft_id=91881321"
   
   export default {
     components: {
       
     },
     data() {
       return {
        IAID : "AE12345BA",
        IframeConfigId : "12312412412424534563"
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
       launchIframe() {
         console.log("**** Iframe should lauch in secs ");
         
         axios
        .get(localConfigUrl)
        .then(function (response) {
          console.log("Getting data about nft ", response.data);
        })
        .catch(function (error) {
          console.log("Getting data : ", error);
        });
        
       },
      
       async todo() {
         // 'https://cdn.discordapp.com/avatars/{user_id}/{user_avatar}.png'
       },
     }
   };
   
   </script>
   