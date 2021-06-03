/**
 * 
_____/\\\\\\\\\\\__________________/\\\\\\________/\\\\\\\\\\\\__/\\\\\\____________________________________        
 ___/\\\/////////\\\_______________\////\\\______/\\\//////////__\////\\\____________________________________       
  __\//\\\______\///___________________\/\\\_____/\\\________________\/\\\____________________________________      
   ___\////\\\_____________/\\\\\_______\/\\\____\/\\\____/\\\\\\\____\/\\\________/\\\\\_____/\\____/\\___/\\_     
    ______\////\\\________/\\\///\\\_____\/\\\____\/\\\___\/////\\\____\/\\\______/\\\///\\\__\/\\\__/\\\\_/\\\_    
     _________\////\\\____/\\\__\//\\\____\/\\\____\/\\\_______\/\\\____\/\\\_____/\\\__\//\\\_\//\\\/\\\\\/\\\__   
      __/\\\______\//\\\__\//\\\__/\\\_____\/\\\____\/\\\_______\/\\\____\/\\\____\//\\\__/\\\___\//\\\\\/\\\\\___  
       _\///\\\\\\\\\\\/____\///\\\\\/____/\\\\\\\\\_\//\\\\\\\\\\\\/___/\\\\\\\\\__\///\\\\\/_____\//\\\\//\\\____ 
        ___\///////////________\/////_____\/////////___\////////////____\/////////_____\/////________\///__\///_____
  
 * Hi, welcome to the SolGlow front-end source code.

 * 
 *  To run locally:
 *  -------------------------------
 *  python -m SimpleHTTPServer 8000
 *  -------------------------------
 * 
 *  To launch on the staging https://solglow.zeronft.com and simply push to master
 *  and it will trigger the deployment flow
 */


/** =====================
 *  Global vars/constants
 *  ===================== */

 

var sentToken = "", solana
const localStorage = window.localStorage
var framesdk // global variable
framesdk = window.posthog // set global variable for FrameSDK tracking
const FRAMESDK_API_KEY = "32e3e6fe-ae72-11eb-8529-0242ac130003" //arbitrary API key
const FRAMESDK_ENDPOINT = "https://api.framesdk.io" // URL to Frame SDK API
const playNowButton = document.getElementById('walletPrompt') // the white play button on upper right hand

//Create the event listener for the play button. Basically we just want to capture the event for analytics
playNowButton.addEventListener('click', () => {
    framesdk.capture('click_select_wallet')
})


/** ====================
 *  Wait for DOM to load
 *  ==================== */




document.addEventListener("DOMContentLoaded", function () {

  //once the DOM loads and Frame SDK JS loads, assign the global var to the instance
  framesdk = window.posthog
  solana = window.solana

  console.log('main solana:')
  console.log(solana)


  // declare our app instance for Vue
  var app = new Vue({
    /** ========================
     *  Attach Vue instance here
     *  ======================== */
    el: '#app',

    /** ===================
     *  Global vars for app
     *  =================== */
    data: {
      networkIcon: 'https://phantom.app/img/logo_large.png',//'https://cdn.iconscout.com/icon/free/png-512/metamask-2728406-2261817.png',
      solana: solana,
      solanaWeb3:solanaWeb3,
      solanaConnection: null,
      sizeClass:'size-desktop',
      
      isHardCodedWallet: false, // this is the checkbox, we hardcode to load NFTs if user has none
      userEmailAddress: null, // email address

      //this is set and gets replaced when spencer compiles
      unityMacro: {
        product_name: '{{{ PRODUCT_NAME }}}'
      },
      
      //frameFP is the browser fingerprint digest created by Fingerprint JS
      frameFP: window.frameFP,

      //whether we are currently loading, display loading screen, if false hide it
      isLoadingAssets: false,

      //should we be showing the Unity game screen
      isShowGame: false,

      //should we be showing the NFT gallery
      isShowAssets: true,

      //class name for that console bar at the bottom
      consoleClass: null,
      userEmail: null,

      //the ethereum network in use
      network: null,

      //avatar of the user
      userAvatar: null,

      //default console text
      consoleText: 'Welcome to Zero NFT and awesome NFT game',

      //default wallet prompt
      walletPrompt: 'Select Wallet',

      //ETH wallet address
      walletAddress: 'Please click connect to launch Metamask 👉',

      //whether assets have been loaded or not, this is the array
      walletAssets: false,

      //element ID of the button to select wallet
      btnConnectWallet: '#select-wallet',

      //web3 instance to communicate w/ infura and web3
      web3: new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/ef5cffbff1544fcb81e65f2c4378b0ac")),

      //wallet balance in ETH
      walletBalance: false,

      //DOM reference to Unity instance
      gameInstance: null,

      //header of the modal
      modalHeader: 'Select a Network',
      btnTxtAuthPhantom: 'Connect to Solana',
      btnTxtAuthMetaMask: 'Connect to Ethereum',
      btnTxtAuthGoogle: 'Authenticate with Google',
      btnTxtAuthEmail: 'Open Wallet',

      //list of all the users wallets
      userWallets: [],

      // All the game assets
      romAssets: {
        'A9kqPvg2FxTL5t1Th72hvviodt2LyTzjQHKKfUtKmCqv': {
          title: 'Super Solana Cart',
          rom_url: 'https://solglow.zeronft.com/rom/Super Solana Kart.smc',
          system: 'snes',
          img_url: [
            'https://www.mobygames.com/images/covers/l/24155-super-mario-kart-snes-front-cover.jpg',
            'https://www.mobygames.com/images/covers/l/68920-super-mario-kart-snes-back-cover.jpg'
          ],
          style: [
            'background-size: 200px 130px;background-image:url("https://www.mobygames.com/images/covers/l/24155-super-mario-kart-snes-front-cover.jpg");',
            'background-size: 200px 130px;background-image:url("https://www.mobygames.com/images/covers/l/68920-super-mario-kart-snes-back-cover.jpg");'
          ],
          token_id: 'A9kqPvg2FxTL5t1Th72hvviodt2LyTzjQHKKfUtKmCqv',
        },
        '6Ti9XSNpiTMpsbVfDLVeL4xaYFhNLc4HXT99EDmnUYpd': {
          title: 'Starfox: Degen Academy',
          rom_url: 'https://solglow.zeronft.com/rom/STARFOX_memes_dog.SFC',
          system: 'snes',
          img_url: [
            'https://commondatastorage.googleapis.com/images.pricecharting.com/AMIfv96mKjNTuxjSwnpVJqvMNs7ZaIyA0vREwgPb7Gazqbq7T-NsRgSdSHdbJ1PNh4jeE_RMFtP6NqFnrXaXG0rKUBfmnzzrxcoD70iARkRYQBksY5zElZZr-yhwU5TiF-hNH3IrJ9pdQcLBVe3zWQd99XAF-EQvaA/240.jpg',
            'https://commondatastorage.googleapis.com/images.pricecharting.com/AMIfv9404_wqodSAPUDP5b8_IjcMTOIjMXPrweV-Oumq__t6zhq3_FxyQlnn4TIIDGnIY-9VTqBAwlKm0RZcAA9W1BHnEDd_y2XtFedss1nng0sxFlBLuNt2EqDIC_hNSfVnNiypvbr1dQg-SCXfvchcNvJ87eeepw/240.jpg'
          ],
          style: [
            'background-size: 200px 130px;background-image:url("https://commondatastorage.googleapis.com/images.pricecharting.com/AMIfv96mKjNTuxjSwnpVJqvMNs7ZaIyA0vREwgPb7Gazqbq7T-NsRgSdSHdbJ1PNh4jeE_RMFtP6NqFnrXaXG0rKUBfmnzzrxcoD70iARkRYQBksY5zElZZr-yhwU5TiF-hNH3IrJ9pdQcLBVe3zWQd99XAF-EQvaA/240.jpg");',
            'background-size: 200px 130px;background-image:url("https://commondatastorage.googleapis.com/images.pricecharting.com/AMIfv9404_wqodSAPUDP5b8_IjcMTOIjMXPrweV-Oumq__t6zhq3_FxyQlnn4TIIDGnIY-9VTqBAwlKm0RZcAA9W1BHnEDd_y2XtFedss1nng0sxFlBLuNt2EqDIC_hNSfVnNiypvbr1dQg-SCXfvchcNvJ87eeepw/240.jpg");'
          ],
          token_id: '6Ti9XSNpiTMpsbVfDLVeL4xaYFhNLc4HXT99EDmnUYpd',
        },

        'GfaoD25UdnKGadT6xq9cdv6rSSMFA2bxoSAqFPCoTaLq':{
          title: 'Gradius: Solana\'s Revenge',
          rom_url: 'https://solglow.zeronft.com/rom/Gradius - SolanaHack.nes',
          system: 'nes',
          img_url: [
            'https://www.mobygames.com/images/covers/l/33282-gradius-iii-snes-front-cover.jpg',
            'https://gamefaqs.gamespot.com/a/box/5/4/7/42547_back.jp'
          ],
          style: [
            'background-size: 200px 130px;background-image:url("https://www.mobygames.com/images/covers/l/33282-gradius-iii-snes-front-cover.jpg");',
            'background-size: 200px 130px;background-image:url("https://gamefaqs.gamespot.com/a/box/5/4/7/42547_back.jpg");'
          ],
          token_id: 'GfaoD25UdnKGadT6xq9cdv6rSSMFA2bxoSAqFPCoTaLq',
        },

        '7UYaE6vhu6F3QEKVUg37qos3NbJQqkYyGxV8zXHTSKgv': {
          title: 'Shadow Run',
          rom_url: 'https://solglow.zeronft.com/rom/Shadowrun.smc',
          system: 'snes',
          img_url: [
            'https://www.mobygames.com/images/covers/l/629712-shadowrun-snes-front-cover.jpg',
            'https://www.mobygames.com/images/covers/l/629713-shadowrun-snes-back-cover.jpg'
          ],
          style: [
            'background-size: 200px 130px;background-image:url("https://www.mobygames.com/images/covers/l/629712-shadowrun-snes-front-cover.jpg");',
            'background-size: 200px 130px;background-image:url("https://www.mobygames.com/images/covers/l/629713-shadowrun-snes-back-cover.jpg");'
          ],
          token_id: '7UYaE6vhu6F3QEKVUg37qos3NbJQqkYyGxV8zXHTSKgv',
        },

        'oVkAzvXBzrntHKpvum6kNDyzLfqBWaRAu1hTpfeRptU': {
          title: 'Space Invaders',
          rom_url: 'https://solglow.zeronft.com/rom/Space Invaders (USA).smc',
          system: 'snes',
          img_url: [
            'https://www.mobygames.com/images/covers/l/68477-space-invaders-snes-front-cover.jpg',
            'https://www.mobygames.com/images/covers/l/68478-space-invaders-snes-back-cover.jpg'
          ],
          style: [
            'background-size: 200px 130px;background-image:url("https://www.mobygames.com/images/covers/l/68477-space-invaders-snes-front-cover.jpg");',
            'background-size: 200px 130px;background-image:url("https://www.mobygames.com/images/covers/l/68478-space-invaders-snes-back-cover.jpg");'
          ],
          token_id: 'oVkAzvXBzrntHKpvum6kNDyzLfqBWaRAu1hTpfeRptU',
        },
        'XhKzZ58UokfQvPa8VTSXadVKcWuuzbS7egYuYMjgDye': {
          title: 'Contra III',
          rom_url: 'https://solglow.zeronft.com/rom/Contra III - The Alien Wars.smc',
          system: 'snes',
          img_url: [
            'https://www.mobygames.com/images/covers/l/70112-contra-iii-the-alien-wars-snes-front-cover.jpg',
            'https://www.mobygames.com/images/covers/l/586315-contra-iii-the-alien-wars-snes-back-cover.png'
          ],
          style: [
            'background-size: 200px 130px;background-image:url("https://www.mobygames.com/images/covers/l/70112-contra-iii-the-alien-wars-snes-front-cover.jpg");',
            'background-size: 200px 130px;background-image:url("https://www.mobygames.com/images/covers/l/586315-contra-iii-the-alien-wars-snes-back-cover.png");'
          ],
          token_id: 'XhKzZ58UokfQvPa8VTSXadVKcWuuzbS7egYuYMjgDye',
        },
        '4v5iS7demX7W3WhthddzUtM7u42v921g1mGXvbjYqXqv': {
          title: 'F-Zero',
          rom_url: 'https://solglow.zeronft.com/rom/F-Zero.smc',
          system: 'snes',
          img_url: [
            'https://www.mobygames.com/images/covers/l/37387-f-zero-snes-front-cover.jpg',
            'https://www.mobygames.com/images/covers/l/57407-f-zero-snes-back-cover.jpg'
          ],
          style: [
            'background-size: 200px 130px;background-image:url("https://www.mobygames.com/images/covers/l/37387-f-zero-snes-front-cover.jpg");',
            'background-size: 200px 130px;background-image:url("https://www.mobygames.com/images/covers/l/57407-f-zero-snes-back-cover.jpg");'
          ],
          token_id: '4v5iS7demX7W3WhthddzUtM7u42v921g1mGXvbjYqXqv',
        },

      

        'wc6RRTr1RpvpDiybHFUSoUQGpNrcVoVSmgQwZCYgCpq': {
          title: 'Super Metroid',
          rom_url: 'https://solglow.zeronft.com/rom/Super Metroid.smc',
          system: 'snes',
          img_url: [
            'https://www.mobygames.com/images/covers/l/35570-super-metroid-snes-front-cover.jpg',
            'https://www.mobygames.com/images/covers/l/16502-super-metroid-snes-back-cover.jpg'
          ],
          style: [
            'background-size: 200px 130px;background-image:url("https://www.mobygames.com/images/covers/l/35570-super-metroid-snes-front-cover.jpg");',
            'background-size: 200px 130px;background-image:url("https://www.mobygames.com/images/covers/l/16502-super-metroid-snes-back-cover.jpg");'
          ],
          token_id: 'wc6RRTr1RpvpDiybHFUSoUQGpNrcVoVSmgQwZCYgCpq',
        },

        '6LTwXnjR5wobbe7q9ciVN8wcXBHbEv2YEFUUiwkBaKHz': {
          title: 'Battletoads & Double Dragon: The Ultimate Team',
          rom_url: 'https://solglow.zeronft.com/rom/Battletoads & Double Dragon - The Ultimate Team.smc',
          system: 'snes',
          img_url: [
            'https://www.mobygames.com/images/covers/l/34522-battletoads-double-dragon-snes-front-cover.jpg',
            'https://www.mobygames.com/images/covers/l/34523-battletoads-double-dragon-snes-back-cover.jpg'
          ],
          style: [
            'background-size: 200px 130px;background-image:url("https://www.mobygames.com/images/covers/l/34522-battletoads-double-dragon-snes-front-cover.jpg");',
            'background-size: 200px 130px;background-image:url("https://www.mobygames.com/images/covers/l/34523-battletoads-double-dragon-snes-back-cover.jpg");'
          ],
          token_id: '6LTwXnjR5wobbe7q9ciVN8wcXBHbEv2YEFUUiwkBaKHz',
        },

        '3qsxdM82aaZJC7DrATYyLMFh9wPJCeuXgZbyqMQHxLvN': {
          title: 'Darius Twin',
          rom_url: 'https://solglow.zeronft.com/rom/Darius Twin (USA).smc',
          system: 'snes',
          img_url: [
            'https://gamefaqs.gamespot.com/a/box/6/0/0/50600_front.jpg',
            'https://gamefaqs.gamespot.com/a/box/6/0/4/50604_back.jpg'
          ],
          style: [
            'background-size: 200px 130px;background-image:url("https://gamefaqs.gamespot.com/a/box/6/0/0/50600_front.jpg");',
            'background-size: 200px 130px;background-image:url("https://gamefaqs.gamespot.com/a/box/6/0/4/50604_back.jpg");'
          ],
          token_id: '3qsxdM82aaZJC7DrATYyLMFh9wPJCeuXgZbyqMQHxLvN',
        },
      },

    },

    /** =============
     *  Computed vars
     *  ============= */
 
    computed: {
      btnStatus: function()  {
       return {
        'classDisabled cmn-btn': !this.userEmailAddress,
        'classEnabled cmn-btn': this.userEmailAddress
      }
    },
      isPhantomInstalled: function() {
        return this.solana && this.solana.isPhantom
       },



    //whether the game is visible or not
      gameVisibility: function () {
        return {
          'classHidden': !this.isShowGame,
          'classShow d-flex justify-content-center': this.isShowGame
        }
      }
    },

    /** ===========
     *  App methods
     *  =========== */
    methods: {

      /** ========================
       *  Grab Balance (etherscan)
       *  ======================== */
      getWalletBalance: async function(address) {

        //call frame SDK API
        const res = await axios.get(`${FRAMESDK_ENDPOINT}/get-wallet?api_key=${FRAMESDK_API_KEY}&wallet_address=${address}`).then(function(response){
          var data = response.data
          return data
        })
        return res
      },

    /** ============
     *  Get Location
     *  ============ */

      //call frame SDK API, it will grab IP from Cloudflare header or you can provide it as the parameter ip_address
      getLocation: async function(){
        url = `${FRAMESDK_ENDPOINT}/get-ip?api_key=${FRAMESDK_API_KEY}`
        const result = await axios.get(url, { headers: {Accept:"application/json"} }).then(function(o){
            console.log('get_location data: ')
            console.log(o.data)
            return o.data
        })
        return result
      },

      /** ============================
       *  Store wallet in LocalStorage
       *  ============================ */
      saveWallet: async function() {

        //when called, stores wallet in users browser LocalStorage

        var _this = this //JS scoping is annoying

        //lets load from localstorage
        var wallet = localStorage.getItem('frameWallet')

        //if it hasn't been saved before it will be null
        if(!wallet || typeof wallet === 'undefined') {

          //lets create an object if it doesn't exist
          wallet = {}
          console.log('Wallet does not exist')

          //lets set the key to the network (test-net vs mainnet)
          wallet[this.network] = {}

          //lets also add the key of the current wallet address
          wallet[this.network][this.walletAddress] = {}
        } else {

          //if the wallet did exist, lets parse the JSON!
          console.log('We loaded the wallet:')
          wallet = await JSON.parse(localStorage.getItem('frameWallet'))
          console.log(wallet)
        }

        //initialize network if it doesn't exist
        if(typeof wallet[this.network] == 'undefined') wallet[this.network] = {}
        
        //initialize wallet if it doesn't exist
        if(typeof wallet[this.network][this.walletAddress] == 'undefined') wallet[this.network][this.walletAddress] = {}
        
        console.log(`### setting wallet balance to: ${this.walletBalance}`)

        //now with everything set, lets grab the wallet balance from our API
        //you can subtitute this with any free API like etherscan
        wallet[this.network][this.walletAddress] = await this.getWalletBalance(this.walletAddress)

        let data = {}

        //set the balance
        data[`${this.network}.eth.${this.walletAddress}`] = this.walletBalance

        //fire off analytics, you can ignore or remove this if you want
        await framesdk.people.set(data)
        await framesdk.people.set({user_agent: navigator.userAgent})
        await framesdk.people.set(await this.getLocation())

        //now lets save it locally
        localStorage.setItem('frameWallet', JSON.stringify(wallet))

        //fireoff more analytics
        framesdk.capture(
          'save_wallet', 
          properties=wallet,
          timestamp=_this.getTimestamp()
        )
      },

      /** ==============================
       *  Grab Wallet Tokens (Etherscan)
       *  ============================== */


      getWalletAssetsSolana: async function(wallet_address) {
        const _this = this

        var _assets = []

        if(typeof this.walletAddress == 'undefined' || !this.walletAddress) {
          console.log('!!! ERROR. wallet address not avail')
          return false
        }

        console.log(`### checking solana wallet address ${wallet_address} for NFTs`)



        for (const [key, o] of Object.entries(this.romAssets)){ 
          console.log(`checking for NFT token ID: ${o.token_id}`)
          var data = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getTokenAccountsByOwner",
            "params": [
              this.walletAddress,
              {
                "mint": o.token_id
              },
              {
                "encoding": "jsonParsed"
              }
            ]
          }
           await axios.post(`https://api.devnet.solana.com`, data).then(function(res){

           

            try {
              var _token = res.data.result.value[0].account.data.parsed.info.mint
              console.log(`#### looking up token: ${_token}`)
              _assets.push(_this.romAssets[_token])

            } catch (e) {
              console.log('!!! error reading token:')
              console.log(e)
              console.log('response:')
              console.log(res.data)
              return false
            }

            


          })
          // console.log('POST data:')
          // console.log(data)
    
   
          
        }

        
        console.log('### assets complete:')
        console.log(_assets)
        this.walletAssets = _assets



        //if there are 1 or more, lets say how many we found
        if (this.walletAssets.length > 0) {
          this.consoleWriter(this.walletAssets.length + ' NFTs found in your wallet')
          console.log('## Assets:')
          console.log(this.walletAssets)

        //fire off some analytics
        // framesdk.capture(
        //   'user_load_game_nft', 
        //   properties=assets,
        //   timestamp=_this.getTimestamp()
        // )

        //initialize the jQuery slider once we have all the NFts loaded
        _this.showGameMenu()


        } else  _this.consoleWriter('😞... Sorry, no NFTs found. Maybe go get some?')
        

        return _assets

      },

      //this is where we grab the NFTs
      getWalletAssets: async function(wallet_address, limit) {
        const _this = this

        //show that we're doing something at the bottom of the screen
        setTimeout(() => {
          _this.consoleWriter('Searching for NFTs... 🔍🧸')
        }, 1500)

        //if the user wanted to use a hardcoded wallet with NFTs, lets set it, otherwise use what was provided
        if(this.isHardCodedWallet) wallet_address = '0xb7f7f6c52f2e2fdb1963eab30438024864c313f6'//'0x511129d64ed1568d2e8afaeadbb7a89181049945'//'0xb7f7f6c52f2e2fdb1963eab30438024864c313f6'
        
        //call the Frame SDK to get assets. Essentially you can just call OpenSea's APIs which is free and open
        const assets = await axios.get(`${FRAMESDK_ENDPOINT}/get-nft?api_key=${FRAMESDK_API_KEY}&wallet_address=${wallet_address}`).then(function(response){
          var data = response.data

          //return the data to the caller
          return data
        }).catch(function (error) {
          _this.consoleWriter('.. there was an error accessing NFTs: ' + error)
          console.log('## ERROR')
          console.log(error)
        })

        //set the NFT global variable
        this.walletAssets = assets

        //if there are 1 or more, lets say how many we found
        if (this.walletAssets.length > 0) {
          this.consoleWriter(this.walletAssets.length + ' NFTs found in your wallet')
          console.log('## Assets:')
          console.log(this.walletAssets)

        //fire off some analytics
        framesdk.capture(
          'user_load_game_nft', 
          properties=assets,
          timestamp=_this.getTimestamp()
        )

        //initialize the jQuery slider once we have all the NFts loaded
        setTimeout(()=>{

          //initialize Slick Slider
          $('.blog-slider').slick({
            autoplay: false,
            slidesToShow: 4,
            slidesToScroll: 4,
            infinite: false,
            speed: 700,
            arrows: true,
            dots: false,
            prevArrow: '<div class="prev"><img src="assets/images/elements/prev-btn.png"></div>',
            nextArrow: '<div class="next"><img src="assets/images/elements/next-btn.png"></div>',
            responsive: [
              {
                breakpoint: 1200,
                settings: {
                  slidesToShow: 4
                }
              },
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 4
                }
              }
            ]
          });
          

        }, 200)

        } else  _this.consoleWriter('😞... Sorry, no NFTs found. Maybe go get some?')
        

      },

      /** ====================
       *  When wallet switches
       *  ==================== */

      //this gets triggered if the user switches wallets
      walletChanged: async function() {
        var _this = this
        if(this.network)
        {

          // set the global var for wallet address to the Ethereum libs current address
          this.walletAddress = await ethereum.selectedAddress
          console.log(`Wallet address changed to ${this.walletAddress}`)

          //since we changed, get the balance
          this.walletBalance = await this.getBalance(this.walletAddress)

          //since we changed, save the new information
          await this.saveWallet()

          //fire off the event to analytics
          await framesdk.capture(
            'user_wallet_change', 
            properties={ walletAddress:this.walletAddress, balance: this.walletBalance, user_agent: navigator.userAgent},
            timestamp=_this.getTimestamp()
          )
        }
      },

      /** =======================
       *  Target element visible?
       *  ======================= */
      isElementInViewPort: function(el) {
        const rect = el.getBoundingClientRect()
    
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            (   
                window.innerHeight || 
                document.documentElement.clientHeight
            ) >= rect.bottom &&
            (
                window.innerWidth || 
                document.documentElement.clientWidth
            ) >= rect.right
        )

      },
      
      /** =====================
       *  Create Unix Timestamp
       *  ===================== */
      getTimestamp: function() {
        return Math.floor(new Date().getTime()/1000)
      },

      /** ==========================
       *  Did we change ETH networks
       *  ========================== */

      // if the network changes, update the global var
      networkChanged: async function (network) {
        var _this = this

        //fire off analytics
        framesdk.capture(
          'user_network_change', 
          properties={ network: network},
          timestamp=_this.getTimestamp()
        )
        switch(network)
        {
          case '0x1': return 'eth-mainnet'
          case '0x3': return 'eth-testnet-ropsten'
          case '0x4': return 'eth-testnet-rinkeby'
          case '0x5': return 'eth-testnet-goerli'
          case '0x2a': return 'eth-testnet-kovan'
          default: return false
        }


      },

      /** ======================
       *  Trigger Metamask Perms
       *  ====================== */

      //trigger the web3 interface to show the wallet selection display in metamask
      requestPermissions: function() {
        ethereum
          .request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }],
          })
          .then((permissions) => {
            const accountsPermission = permissions.find(
              (permission) => permission.parentCapability === 'eth_accounts'
            );
            if (accountsPermission) {
              console.log('eth_accounts permission successfully requested!');
            }
          })
          .catch((error) => {
            if (error.code === 4001) {
              // EIP-1193 userRejectedRequest error
              console.log('Permissions needed to continue.');
            } else {
              console.error(error);
            }
          });
      },

      /** ==========================
       *  Trigger Metamask Auth Flow
       *  ========================== */

      authPhantom: async function() {
        this.solana = window.solana
       
        console.log('Game visibility: ' + this.isShowGame + ' ' + this.gameVisibility)
  
        console.log('### SOLANA:')
        console.log(this.solana)
        if(!this.isPhantomInstalled) {
          console.log('### Phantom NOT installed')
          this.consoleWriter('Yikes. Phantom is required to play.')
          return false
        }
        
        console.log('### Phantom is installed!!')
        this.consoleWriter('Congrats, you have Phantom installed 👍')

        //window.solana.connect()

        window.solana.on("connect",await this.getPhantomWallet)
        this.networkIcon = 'https://phantom.app/img/logo_large.png'

        //this.solana.request({url:"http://devnet.solana.com/", method: "connect" })
        this.solana.connect({method:'connect',url:'https://devnet.solana.com/'})
        this.solanaConnection = new this.solanaWeb3.Connection('https://devnet.solana.com/')

        this.network = 'solana-devnet'

    
        


      },

      selectGame: async function() {
        //this.loadGame()
        this.isShowGame = true
        this.isShowAssets = false
        this.isLoadingAssets = false
        this.walletAssets = true
      },

      reloadGameMenu: function() {
        window.location.hash = this.walletAddress
        window.location.reload()
      },

      showGameMenu: async function() {
        //this.loadGame()
        const _this = this
        this.isShowGame = false
        this.isLoadingAssets = false
        this.isShowAssets = true
       
        
        setTimeout(()=>{

          //initialize Slick Slider
          $('.blog-slider').slick({
            autoplay: false,
            slidesToShow: 4,
            slidesToScroll: 4,
            infinite: false,
            speed: 700,
            arrows: true,
            dots: false,
            prevArrow: '<div class="prev"><img src="assets/images/elements/prev-btn.png"></div>',
            nextArrow: '<div class="next"><img src="assets/images/elements/next-btn.png"></div>',
            responsive: [
              {
                breakpoint: 1200,
                settings: {
                  slidesToShow: 4
                }
              },
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 4
                }
              }
            ]
          });
       
        
          
        }, 200)

        
       

        // this.isShowGame = true
        // this.isShowAssets = false
        // this.isLoadingAssets = false
        // this.walletAssets = true
      },

      getPhantomWallet:async function(wallet_address) {
        
        console.log('### getPhantomWallet')

 
        framesdk.capture(
          'click_auth_phantom', 
          properties={user_agent: navigator.userAgent},
          timestamp=this.getTimestamp()
        )

 
       


         //show loading screen
         this.isLoadingAssets = true

        //  // Load Metamask UI to select wallet
        //  this.walletAddress = await ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
        //    return accounts[0]
        //  })

        this.consoleWriter('...Retrieving your wallet')


        if(wallet_address && wallet_address.length > 40)
          this.walletAddress = wallet_address
        else
        {
          this.walletAddress = this.solana.publicKey.toString()
          this.walletBalance = await this.solanaConnection.getBalance(this.solana.publicKey)
          this.walletBalance = this.walletBalance * 0.000000001
          this.walletPrompt = 'Balance: ' + this.walletBalance.toString().substring(0,6)

        }

        
 

        console.log('Wallet address: ' + this.walletAddress)

        //grab the wallet balance
        //const wallet = await this.getWalletBalance(this.walletAddress)
        //update the vars
        //this.walletBalance = await this.solana.request({method:'getBalance', params:{publicKey: this.walletAddress}})
        

        this.consoleWriter('Wallet found 👉 ' + this.walletAddress + ' w/ balance: ' + this.walletBalance)

        console.log(`### network: ${this.network}`)

        this.getWalletAssetsSolana()


        // await this.saveWallet()
        // console.log('Wallet data saved')

      },

      //this is the function that gets called when you click the metamask button
      authMetaMask: async function() {
        
        var _this = this

        //fire off some analytics
        framesdk.capture(
          'click_auth_metamask', 
          properties={user_agent: navigator.userAgent},
          timestamp=_this.getTimestamp()
        )
        // Load Metamask UI to select wallet
        // this.walletAddress = await ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
        //   return accounts[0]
        // })

        //get the wallet tokens
        await this.getWallet()

        //get the wallet NFTs, limit it to 20 NFTs
        await this.getWalletAssets(this.walletAddress,20)
        
          
      },

      /** ==========================
       *  Load Wallet from Meta Mask
       *  ========================== */
      
      getWallet: async function () {

        //show loading screen
        this.isLoadingAssets = true

        // Load Metamask UI to select wallet
        this.walletAddress = await ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
          return accounts[0]
        })

        this.consoleWriter('...Retrieving your wallet')

        console.log('Wallet address: ' + this.walletAddress)

        //grab the wallet balance
        const wallet = await this.getWalletBalance(this.walletAddress)

        //update the vars
        this.walletBalance = wallet['balance_eth']
        this.walletPrompt = 'Balance: ' + this.walletBalance.toString().substring(0,6)

        this.consoleWriter('Wallet found 👉 ' + this.walletAddress + ' w/ balance: ' + this.walletBalance)

        this.network = await ethereum.request({ method: 'eth_chainId' }).then((network) => {
          console.log(`chain_id: ${network}`)
          
          switch(network)
          {
            case '0x1': return 'eth-mainnet'
            case '0x3': return 'eth-testnet-ropsten'
            case '0x4': return 'eth-testnet-rinkeby'
            case '0x5': return 'eth-testnet-goerli'
            case '0x2a': return 'eth-testnet-kovan'
            default: return false
          }
        })
        console.log(`### network: ${this.network}`)

        await this.saveWallet()
        console.log('Wallet data saved')
      },

      /** =========
       *  Load NFTs
       *  ========= */

      //this gets triggered when a user selects an NFT

      loadNFT: function (token_id,game_system, rom_url) {
        console.log(`token_id: ${token_id} game_system: ${game_system} rom_url: ${rom_url}`)
        var _this = this
        this.consoleWriter(`token_id: ${token_id} game_system: ${game_system} rom_url: ${rom_url}`)


        const scriptList = document.getElementsByTagName("script")
        const convertedNodeList = Array.from(scriptList)
        for(i=0;i<=convertedNodeList.length-1;i++)
        {
          console.log('### script: ' + convertedNodeList[i].src)
          if(
            convertedNodeList[i].src.indexOf('www.emulatorjs.com') > -1 
            )
            {
              console.log('## FOUND and removing: ' + convertedNodeList[i].src)
              convertedNodeList[i].parentNode.removeChild(convertedNodeList[i])
            }

        }
       


        emu1 = document.querySelector("#emulator1");
        emu2 = document.querySelector('#emulator2')

        if(emu1 && emu2)
        {
          console.log('## found them and removing them!')
          emu1.remove()
          emu2.remove()

          document.head.getElementsByTagName('script')[0].remove()
          document.head.getElementsByTagName('script')[0].remove()
        }

   
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
           this.sizeClass = 'size-mobile'
           console.log('#### size-mobile')

        } else {
          this.sizeClass = 'size-desktop'
          console.log('#### size-desktop')

        }
  
        var script2 = document.createElement("script")
        var script = document.createElement("script")

        script.id = 'emulator1'
        script2.id = 'emulator2'
  
        script.type = 'text/javascript'
        script2.type = 'text/javascript'
        script.src = 'https://www.emulatorjs.com/loader.js'
        script2.innerHTML = `
          EJS_player = '#game';
          EJS_gameUrl = '${rom_url}'; // Url to Game rom
          EJS_gameID = 2; // ID in your website, required for netplay.
          EJS_core = '${game_system}';
          EJS_mouse = false; // SNES Mouse
          EJS_multitap = false; // SNES Multitap
        `
        script.onload = () => {
          console.log('### script loaded just fine :)')
        };
        document.body.appendChild(script2)
        document.body.appendChild(script)

        //hide the NFT selection screen
        this.isShowAssets = false

        //show the Unity screen
        this.isShowGame = true

        //fire off some analytics
        framesdk.capture(
          'game_solglow_did_load', 
          properties={ walletAddress:this.walletAddress, balance: this.walletBalance, rom_url: rom_url, token_id: token_id},
          timestamp=_this.getTimestamp()
        )



      },

      //nothing
      receiveMessageFromUnity: function (msg) {

      },

      /** ============
       *  Unity Bridge
       *  ============*/
      sendMessageToUnity: function (msg, type) {
        // Params: "Target object in the scene", "Function name", "Parameters"
        console.log('Sending message: ' + msg)
        this.gameInstance.SendMessage(
          "[Bridge]",
          type,
          msg
        );
      },


      /** ===============
       *  App Entry-point
       *  =============== */
      initialize: function () {

        var _this = this

        // //set the event listener if the user changes account on meta mask
        // ethereum.on('accountsChanged', function (accounts) {
        //   _this.walletChanged()
        // });

        // //set the event listener if the user changes the network on metamask (mainnet vs testnet)
        // ethereum.on('chainChanged',function(network){
        //   console.log(`## network changed`)
        //   _this.network =  _this.networkChanged(network)
        //   _this.walletChanged()
        // });
        
        /** Setup Fingerprinting */
        const fpPromise = FingerprintJS.load()
    
        // Get the visitor identifier when you need it.
        fpPromise
          .then(fp => fp.get())
          .then(result => {
            // This is the visitor identifier:
            const visitorId = result.visitorId
            window.frameFP = visitorId
            this.frameFP = visitorId
            console.log('#### frameFP:')
            framesdk.identify(this.frameFP);
            console.log(`### FP: ${visitorId}`)
        })
        //this.loadGame()

        // address provided in hash
        if(window.location.hash.length > 40)
         {
          this.getPhantomWallet(window.location.hash.substr(1,window.location.hash.length - 1))
            
         }
      },

      /** ===================
       *  Load the Unity Game
       *  =================== */
      loadGame: async function() {

    //     var container, unitycanvas, loadingBar, progressBarFull, fullscreenButton, mobileWarning, _this = this
        
    //     var buildUrl = "Build", loadUrl, config

    //     //different configurations for zeronft.com proper vs dora.zeroft.com
        
    //     switch(window.location.pathname)
    //     {

    //       //these settings are for the hackathon
    //       case '/bomberman/':
    //         loaderUrl = buildUrl + "/nft-hackathon.loader.js";
    //         config = {
    //           dataUrl: buildUrl + "/nft-hackathon.data",
    //           frameworkUrl: buildUrl + "/nft-hackathon.framework.js",
    //           codeUrl: buildUrl + "/nft-hackathon.wasm",
    //           streamingAssetsUrl: "StreamingAssets",
    //           companyName: "DefaultCompany",
    //           productName: "nft-hackathon",
    //           productVersion: "1.9",
    //         };
    //       break;

    //       default:

    //       //these settings are for zeronft.com
    //         loaderUrl = buildUrl + "/Pets - WebGL-Web3.asm.loader.js";
    //         config = {
    //           dataUrl: buildUrl + "/Pets - WebGL-Web3.data",
    //           frameworkUrl: buildUrl + "/Pets - WebGL-Web3.asm.framework.js",
    //           codeUrl: buildUrl + "/Pets - WebGL-Web3.asm.js",
    //           memoryUrl: buildUrl + "/Pets - WebGL-Web3.asm.mem",
    //           streamingAssetsUrl: "StreamingAssets",
    //           companyName: "DefaultCompany",
    //           productName: "Pets",
    //           productVersion: "1.6",
    //         };
    //       break;
    //     }
    //  container = document.querySelector("#game-container");
    //  game = document.querySelector('#game')

    //  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    //     this.sizeClass = 'size-mobile'
    //     console.log('#### size-mobile')

    //     //container.className = "game-mobile";
    //     //game.className = 'size-mobile'
    //     // unitycanvas.style.width = "960px";
    //     // unitycanvas.style.height = "600px";
    //   } else {
    //     this.sizeClass = 'size-desktop'
    //     console.log('#### size-desktop')
    //     // container.className = "game-desktop"
    //     //unitycanvas.style.width = "450px";
    //     //unitycanvas.style.height = "320px";
    //     //game.className = 'size-desktop'
    //   }

    //   var script2 = document.createElement("script")
    //   var script = document.createElement("script")
    //       script.type = 'text/javascript'
    //       script2.type = 'text/javascript'
    //       script.src = 'https://www.emulatorjs.com/loader.js'
    //       script2.innerHTML = `
    //         EJS_player = '#game';
    //         EJS_gameUrl = 'https://solglow.zeronft.com/rom/Doom.smc'; // Url to Game rom
    //         EJS_gameID = 2; // ID in your website, required for netplay.
    //         EJS_core = 'snes';
    //         EJS_mouse = false; // SNES Mouse
    //         EJS_multitap = false; // SNES Multitap
    //       `
    //       script.onload = () => {
    //         console.log('### script loaded just fine :)')
    //       };
    //       document.body.appendChild(script2)
    //       document.body.appendChild(script)

  //   <script type="text/javascript">
  //   EJS_player = '#game';
  //   EJS_gameUrl = 'https://www.yummyyummytummy.com/n/ro/KillerInstinct.smc'; // Url to Game rom
  //   EJS_gameID = 2; // ID in your website, required for netplay.
  //   EJS_core = 'snes';
  //   EJS_mouse = false; // SNES Mouse
  //   EJS_multitap = false; // SNES Multitap
  // </script>
  // <script src="https://www.emulatorjs.com/loader.js"></script>

    // /** ============
    //  *  Set elements
    //  *  ============ */
    //     container = document.querySelector("#unity-container");
    //     unitycanvas = document.querySelector("#unity-canvas");
    //     loadingBar = document.querySelector("#unity-loading-bar");
    //     progressBarFull = document.querySelector("#unity-progress-bar-full");
    //     fullscreenButton = document.querySelector("#unity-fullscreen-button");
    //     mobileWarning = document.querySelector("#unity-mobile-warning");


    //     if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    //       container.className = "unity-mobile";
    //       config.devicePixelRatio = 1;
    //       mobileWarning.style.display = "block";
    //       setTimeout(() => {
    //         mobileWarning.style.display = "none";
    //       }, 5000);
    //     } else {
    //       unitycanvas.style.width = "960px";
    //       unitycanvas.style.height = "600px";
    //     }
    //     //TODO: uncomment this for Spencer
    //     // #if BACKGROUND_FILENAME
    //     // canvas.style.background = "url('" + buildUrl + "/{{{ BACKGROUND_FILENAME.replace(/'/g, '%27') }}}') center / cover";
    //     // #endif
    //     loadingBar.style.display = "block";
    //     var script = document.createElement("script");
    //     script.src = loaderUrl;
    //     script.onload = () => {
    //       createUnityInstance(unitycanvas, config, (progress) => {
    //         progressBarFull.style.width = 100 * progress + "%";
    //       }).then((unityInstance) => {
    //         loadingBar.style.display = "none";
    //         _this.gameInstance = unityInstance;
    //         _this.isShowAssets = true
    //         _this.isLoadingAssets = false
    //         //   fullscreenButton.onclick = () => {
    //         //   unityInstance.SetFullscreen(1);
    //         // };
    //       }).catch((message) => {
    //         alert(message)
    //       });
    //     };
    //     document.body.appendChild(script)
      },

      /** =======================
       *  Black bar at the bottom
       *  ======================= */
      consoleWriter: function (text) {
        this.consoleText = text
      },

      round: function (value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
      },
      WeiToEth: function (wei) {
        return wei * 0.000000000000000001
      },

      isMetaMaskInstalled: function () {
        const { ethereum } = window
        return Boolean(ethereum && ethereum.isMetaMask)
      },

      // connectSolana: async function() {
      //   console.log('loading solana...')
      //   const clusterApiUrl = this.solanaWeb3.clusterApiUrl,
      //   Connection = this.solanaWeb3.Connection
      //   const networks = {
      //     mainnet: {
      //       url: "https://solana-api.projectserum.com",
      //       displayName: "Mainnet Beta",
      //     },
      //     devnet: { url: clusterApiUrl("devnet"), displayName: "Devnet" },
      //     testnet: { url: clusterApiUrl("testnet"), displayName: "Testnet" },
      //   }
        
      //   const solanaNetwork = networks.devnet
      //   const connection = new Connection(solanaNetwork.url)

      //   const solanaPrivateKey = getSolanaPrivateKey(privKey);
      //   await getAccountInfo(solanaNetwork.url, solanaPrivateKey);

      // }


    },

    /** ================
     *  VueJS entrypoint
     *  ================ */

    mounted() {

      if (this.isMetaMaskInstalled) {
        console.log('You have Metamask installed!')
        this.consoleWriter('Congrats, you have Metamask installed 👍')
      } else {
        console.log('Metamask not installed!')
        this.consoleWriter('Yikes. Metmask is required to play.')
      }
      console.log('Game visibility: ' + this.isShowGame + ' ' + this.gameVisibility)

      // if(this.isPhantomInstalled) {
      //   console.log('### Phantom is installed!!')
      // } else {
      //   console.log('### Phantom NOT installed')
      // }

      this.initialize()

    }
  })


});


