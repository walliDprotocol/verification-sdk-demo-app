## Mintbase <> WalliD Demo:

 1. Launch Creator page [here](https://verification-sdk-demo-webapp.herokuapp.com/creator/) to roleplay as the NFT creator;
 2. Confirm the usernames of the intended royalty owners
 3. Click `Mint`to prompt te identification process
 4. Confirm the Tweet containing the identified users and a URL to verify their IDs
 5. Roleplay as the Royalty owner by clicking the URL embedded in post of the creator
 6. Click `Open iframe`to launch WalliD verification process
 7. Complete The verification and wallet creation process 



## Live demo link
https://verification-sdk-demo-webapp.herokuapp.com/

## Build and deploy

To utilize it within a development environment, the implementation involves employing the `dotenv` module, which allows for the utilization of a .env file to incorporate the subsequent environment variables.

 Here's an example of how the .env file with variables

```
VUE_APP_BACKEND_URL=<backend_url>
VUE_APP_NEAR_SOCIAL_CONTRACT_TESTNET=<contract_address>
VUE_APP_NEAR_SOCIAL_CONTRACT=<social_contract>
VUE_APP_NEAR_NETWORK_TESTNET=testnet
VUE_APP_NEAR_NETWORK=mainnet

# pubnub env vars
VUE_APP_PUBNUB_USER_ID=<pubnub_id>
VUE_APP_PUBNUB_SUBSCRIBE_KEY=<PUBNUB_SUBSCRIBE_KEY>
VUE_APP_PUBLISH_KEY=<PUBLISH_KEY>
```


Install depencies

```
npm install
```

build frontend

```
npm run generate
```

run frontend

```
npm run start
```

## Environment variables

```
BACKEND_URL=<backend_url>
DISCORD_AUTH=<redirect discord url>
DISCORD_GUILD_ID=<discord_server id>
TWITTER_ACCOUNT=<username of account to check follow>
TWITTER_ACCOUNT_ID=<account id of account to check follow>
TWITTER_POST_ID=<post id>
```
