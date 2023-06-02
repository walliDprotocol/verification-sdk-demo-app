# Verification and Authentication Demos.

## About this repo

This repository serves as a comprehensive collection of test environments for various authentication and verification flows supported by WalliD's [`core-config libs`](https://github.com/walliDprotocol/core-config) and [`verification-modal`](https://github.com/walliDprotocol/verification-modal). Its purpose is to demonstrate the typical use cases, providing a valuable resource for developers seeking to explore and implement these functionalities.

## Authentication flow
> To learn all about authentication flows check our documentation [here](https://docs.wallid.io/config-dashboard/authentication).

### Use case

Sign/up users with social logins and/or web3 wallets

### How to test it

- Launch this demo website
- Click on `Sign-up`
- Choose your favourie authenticator and connect with it to complete the process 

### Authenticators configured

#### Social Logins
- Google
- Twitter
- Discord
- OpenAi
- Reddit
- Facebook
#### web3 wallets
- WalliD Wallet
- Metamask
- Wallet connect
 
## Independent verification flow
>To learn all about independent verification flows check our documentation [here](https://docs.wallid.io/config-dashboard/data-verification).

### Use case

Trust scores based on social network history and on-chain credentials

### How to test it

- Launch [this demo website](https://verification-sdk-demo-webapp.herokuapp.com). You’ll see a blank username and trust score of 0. 
- Choose one of the data sources available to verify your data
- Follow the steps displayed in the website to connect to different data sources and verify the requested data
- Check the status of the verified data , username and the increased trust score displayed in the website

### Data sources and parameters configured


| Data Source | Parameter          | Score |
|----------|-----------------------|--------|
| Twitter  | Account               | +1     |
| Twitter  | > 100 followers       | +10    |
| Twitter  | < 1 year account      | +20    |
| Github   | Account               | +1     |
| Github   | <5 repos              | +10    |
| Github   | <5 contributions      | +10    |
| Google   | Account               | +1     |
| NEAR     | Wallet address        | +1     |
| NEAR     | < 10 NEAR tokens      | +50    |



## Combined verification flow
>To learn all about combined verification flows check our documentation [here](https://docs.wallid.io/config-dashboard/data-verification).

### Use case

Airdrop an NFT to a Twitter account after verifying username and token ownership 

### How to test it

- Launch [this demo website](https://wallid-demo-celo.herokuapp.com/). 
- Write your Twitter handle to set it as eligible for the NFT airdrop
- Get 50 WalliD test tokens in the “faucet button”
- Click on “Claim NFT” to launch WalliD flow
- Verify Twitter account
- Verify WalliD token  ownership
- Get access to the NFT claim page

### Data sources and parameters configured

| Data Source | Parameter          | Score |
|----------|-----------------------|--------|
| Twitter  | Account               | +1     |
| Celo | > 10 WalliD rokens       | +50    |









