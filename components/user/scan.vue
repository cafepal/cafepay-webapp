<template>
  <div class="container">
    <div v-if="CustomLoader" id="custom-loader" class="custom-loading"></div>
    <div
      v-if="CustomLoader"
      id="custom-loader-bg"
      class="custom-loading-bg"
    ></div>
    <login
      key="loginmodal-scan"
      id="loginmodal-scan"
      :loginModalActive="loginModalActive"
      @successful="dispatchSendCode"
    />
    <b-modal
      class="simple-action-modal camera-guide-modal"
      :active.sync="accessCameraActive"
      has-modal-card
      :can-cancel="false"
    >
      <div class="modal-card" style="width: auto">
        <section class="modal-dialog">
          <p v-html="$t('scan_page.camera_permission_message')">
            
          </p>
          <!-- <img src="@/assets/img/camera-guide.png" alt="" /> -->
        </section>

        <section class="modal-caption"></section>

        <section class="modal-action">
          <!-- <button class="button ma-child is-light" type="button" @click="closeModal(false)">خیر</button> -->
          <b-button class="ma-child" type="is-info" @click="openCamera"
            >{{ $t('scan_page.open_camera') }}</b-button
          >
        </section>
      </div>
    </b-modal>

    <b-modal
      :active.sync="enterCodeModalActive"
      has-modal-card
      class="simple-action-modal"
    >
      <div class="modal-card" style="width: auto">
        <!-- <header class="modal-card-head">
                  <p class="modal-card-title">وارد کردن کد میز</p>
        </header>-->
        <section class="modal-card-body">
          <!-- <img src="@/assets/img/shape/icons/chair.png" alt=""> -->
          <b-field>
            <b-input
              @keyup.native.enter="tokenProccessor"
              ref="tablecode"
              class="cp-input cp-input-primary cp-input-grey cp-input-shadow"
              type="code"
              v-model="tableCode"
              icon="numeric"
              inputmode="numeric"
              :placeholder="$t('scan_page.enter_table_code')"
            ></b-input>
          </b-field>

          <b-button
            :loading="globalLoading"
            @click="tokenProccessor"
            class="checkCode-btn bcp-btn bcp-btn-large"
            expanded
            :disabled="tableCode == '' ? true : false"
            type="is-info"
            >{{ $t('scan_page.submit_table_code') }}</b-button
          >
        </section>
        <!-- <footer class="modal-card-foot">
          <button class="button" type="button" @click="closeModal">
            بستن پنجره
          </button>
        </footer> -->
      </div>
    </b-modal>
    <b-modal
      :can-cancel="false"
      :active.sync="selectTableModalActive"
      has-modal-card
      class="simple-action-modal"
    >
    
      <div class="modal-card" >
        <section class="modal-dialog">
          <p>
            لطفا شماره میزتان را انتخاب کنید
          </p>
          <!-- <img src="@/assets/img/camera-guide.png" alt="" /> -->
        </section>
        <div style="width: auto; display: flex; flex-wrap: wrap;
            flex-direction: row;
            justify-content: space-around; padding-bottom: 10px;">
        <b-button :key="i" @click="selectTable(i)" type="primary" style="width: 30%;
            height: 45px; margin-top: 10px; color: white;" v-for="(table, i) in likardTables">
          {{ i }}
        </b-button>
        </div>
      </div>
    </b-modal>
    <div class="camera">
      <!-- <component
        @decode="onDecode"
        :is="qrcodeComponentLaunch"
        v-if="letsUseCamera"
      ></component> -->

      <client-only><qrcode-stream v-if="launchCamera"  @decode="onDecode"></qrcode-stream> </client-only>
      <div id="qr-animation"></div>
   
    </div>


    <div class="landing white notLogged-landing" id="bm">
      <div class="camera-scan-guide">
        <img class="camera-scan-guide__icon" :src="qrIcon" alt="" />
        <p class="camera-scan-guide__text">
          {{ $t('scan_page.scan_the_barcode') }}
        </p>
      </div>
      <!-- <p class="camera__scan-text-or">یا</p> -->
      <div class="enter-code-guide">
        <div><p>{{ $t('scan_page.or') }}</p></div>
        <b-button
          @click="openCodeModal"
          class="bcp-btn-large shadow-lg-b"
          type="is-info"
          >{{ $t('scan_page.enter_table_code') }}</b-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import animationJson from '~/assets/img/lf30_editor_3x8g47cn.json'
import loaderJson from '~/assets/img/51-preloader.json'
// import userImg from '~/assets/img/user.jpg'
import walletIcon from '~/assets/img/shape/icons/wallet.png'
import myCafe from '~/assets/img/shape/icons/my-cafe-2.svg'
import qrIcon from '~/assets/img/shape/icons/qr-code-scan.svg'

import lottie from 'lottie-web'
import login from '~/components/user/login'
import Vue from 'vue'
// import { QrcodeStream } from 'vue-qrcode-reader'
import { mapActions } from 'vuex'

const ScanType = Object.freeze({
  LINK: 'link',
  WEBAPP_SCANNER: 'webapp_scanner',
  TABLE_CODE: 'table_code',
  DOMAIN_NAME: 'domain_name',
})

const likardTables = {
  "1": "105208",
  "2": "104056",
  "3": "103696",
  "4": "104657",
  "5": "104438",
  "6": "103905",
  "7": "105154",
  "8": "105162",
  "9": "103762",
  "10": "104142",
}

function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export default {
  components: {
    // QrcodeStream: () => import('vue-qrcode-reader'),
    login,
  },
  data() {
    return {
      likardTables,
      // TODO: handle wrong token from url in a better way to
      // let user scan code again when entered wrong token
      letsUseCamera: !this.$route.query.token,
      launchCamera: false,
      xyz: true,
      animationJson,
      loaderJson,
      // userImg,
      walletIcon,
      myCafe,
      qrIcon,
      CustomLoader: false,
      qrcodeComponentLaunch: null,
      enterCodeModalActive: false,
      tableCode: '',
      accessCameraActive: false,
      loginModalActive: false,
      selectTableModalActive: false,
      selectedTableLog: null,
      scanMode: null,
      sessionId: generateUUID()
    }
  },
  methods: {
    ...mapActions(['sendCode']),
    closeModal() {
      this.enterCodeModalActive = false
    },
    openCamera() {
      this.accessCameraActive = false
      this.launchCamera = true
      // this.qrcodeComponentLaunch = QrcodeStream
    },
    onDecode(token) {
      // token proccessor called by camera or input if it is called by camera it returns string if not it's an input entery
      // by CAMERA
      if(this.loginModalActive || this.enterCodeModalActive || this.CustomLoader) {
        return;
      }
      let tokenValid = !!token &&
                        (
                          token.includes('cfpy.ir')
                          || token.includes('cafepay.app')
                        )
      if(!tokenValid) {
        return;
      }
      this.tokenProccessor(token, true)
    },

    tokenProccessor(urlWithToken, fromWebappScanner) {
      this.scanMode = null;
      if(fromWebappScanner == true) {
        this.scanMode = ScanType.WEBAPP_SCANNER
      } else if(this.tableCode) {
        this.scanMode = ScanType.TABLE_CODE
      }
      if (typeof urlWithToken == 'string') {
        // demo token
        if (urlWithToken == 'https://cafepay.app/?1111') {
          this.tableCode = '12345'
        } else {
          // get subdomain (will be 'cafepay' if running on original domain)
          let subdomain = urlWithToken.split('//')[1].split('.')[0]
          // check if we are not in localhost
          let isCafepaySubDomain = urlWithToken.includes('cfpy.ir')
                          || urlWithToken.includes('cafepay.app')
                          || urlWithToken.includes('cafehedayat.com')
                          // || urlWithToken.includes('likardbistro.ir')
                          // || urlWithToken.includes('likard.ir')
          let isNotReservedSubDomain = !['m', 'cafepay', 'test', 't', 'cfpy', 'en'].includes(subdomain)
          if(isCafepaySubDomain && isNotReservedSubDomain) {
            this.tableCode = subdomain
            this.scanMode = this.scanMode ?? ScanType.DOMAIN_NAME
          } else {
            // will be undefined if no token is in query params
            this.tableCode = urlWithToken.split('?token=')[1]
            this.scanMode = this.scanMode ?? ScanType.LINK
          }
        }
      }
      if(this.tableCode) {
        this.$axios.post('v1/raw-log/create/', {
          text: JSON.stringify({
            token: this.tableCode,
            mode: this.scanMode,
            user: (this.user && this.user.phone_number) ? this.user.phone_number : "none",
            sessionId: this.sessionId
          })
        })
        this.dispatchSendCode()
      } else {
        // enable camera if token is not in sub domain or query params
        this.doLaunchCamera()
      }
    },
    selectTable(selectedTableName) {
      const selectedTableCode = likardTables[selectedTableName]
      const currentTableName = Object.keys(likardTables).find(key => likardTables[key] === this.tableCode);

      if(this.tableCode) {
        this.selectedTableLog = {
            typ: "table-selection",
            status: currentTableName == selectedTableName ? "correct" : "incorrect",
            currentTableName,
            selectedTableName,
          }
      } else {
        this.tableCode = selectedTableCode;
        this.selectedTableLog = {
          typ: "table-selection",
          status: "selected by table selector, likard.ir",
          selectedTableName,
        }
      }
      this.dispatchSendCode()
    },
    doLaunchCamera(){
      // if navigator is supported for camera ask for permission if not just try to initial camera component
      if (navigator.permissions) {
        navigator.permissions
          .query({ name: 'camera' })
          .then((permissionStatus) => {
            if (permissionStatus.state == 'prompt') {
              if (!this.$route.query.token) {
                this.accessCameraActive = true
              }
            } else if (permissionStatus.state == 'granted') {
              this.launchCamera = true
              // this.qrcodeComponentLaunch = null
            }
          })
      } else {
        this.launchCamera = true
        // this.qrcodeComponentLaunch = null
      }
    },
    dispatchSendCode() {
      const isLikardTable = Object.values(likardTables).includes(this.tableCode)

      this.$axios.post('v1/raw-log/create/', {
        text: JSON.stringify({
          token: this.tableCode,
          mode: this.scanMode,
          dispatchSendCode: true,
          user: (this.user && this.user.phone_number) ? this.user.phone_number : "none",
          sessionId: this.sessionId
        })
      })
      if(isLikardTable && !this.selectedTableLog && this.userIsloggedIn) {
        this.$axios.post('v1/raw-log/create/', {
          text: JSON.stringify({
            token: this.tableCode,
            mode: this.scanMode,
            isLikardTable: true,
            user: (this.user && this.user.phone_number) ? this.user.phone_number : "none",
            sessionId: this.sessionId
          })
        })
        this.selectTableModalActive = true
        return
      }
      // u need to set the table too, for api link
      this.CustomLoader = true
      // initial preloader
      setTimeout(() => {
        let preloader = lottie.loadAnimation({
          container: document.getElementById('custom-loader'), // the dom element that will contain the animation
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: this.loaderJson, // the path to the animation json
        })
        preloader.play()
      }, 200)
      
       

      let tableToken = this.convertPersian(this.tableCode)
      this.sendCode({tableToken, hasToken :this.userIsloggedIn})

        .then((res) => {
          if(isLikardTable) {
            this.$axios.post('v1/raw-log/create/', {
              text: JSON.stringify(Object.assign({}, this.selectedTableLog, {
                user: (this.user && this.user.phone_number) ? this.user.phone_number : "none",
                sessionId: this.sessionId
              }))
            })
          }
          this.enterCodeModalActive = false
          this.CustomLoader = false

          if (this.storeRedirect) {
            this.$gtm.trackEvent({
              event: 'Menu-Only--seenMenu', // Event type [default = 'interaction'] (Optional)
              category: 'menu-only',
              action: 'click',
              label: this.$route.query.token,
              value: 'no-value',
              noninteraction: false, // Optional`
            })
          }
        })
        .catch((err) => {
          // for preventing reinitial menu 
          delete this.$route.query.token
          this.CustomLoader = false         

          if (err.response) {
          //  it means wrong table token
            if (err.response.status == 404 || err.response.status == 400) {
              this.$buefy.toast.open({
                duration: 3000,
                message: this.$t('scan_page.code_incorrect'),
                position: 'is-top',
                type: 'is-danger',
              })
              // make sure user can use camera again
              this.doLaunchCamera()
            }
            
            // it means user is not logged in and table requires it so we open login modal
            else if (err.response.status == 401) {
              this.enterCodeModalActive = false
              this.loginModalActive = true
            }
          }
        })
    },

    openCodeModal() {
      this.loginModalActive = false
      this.enterCodeModalActive = true
      setTimeout(() => {
        this.$refs.tablecode.focus()
      }, 200)
    },
  },
  created() {
    this.$nuxt.$on('tigger-token', () => {
     this.tableCode = this.user.table_uuid
     this.dispatchSendCode()
   })
    // if navigator not supported (ios)
    // if (!navigator.permissions && this.fistTimeCameraActive) {
    //   alert(
    //     'جهت اسکن بارکد توسط دوربین درون برنامه، لطفا بعد از مشاهده پیام زیرگزینه Allow را انتخاب نمایید'
    //   )
    //   this.$store.commit('setFirstTimeCameraActive', false)
    // }
  },
  mounted() {
    if(window.location.host == 'likard.ir') {
      this.selectTableModalActive = true
    }
    let h = window.innerHeight
    $('.camera').css({ height: h })

    let qrAnimeObj = lottie.loadAnimation({
      container: document.getElementById('qr-animation'), // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: this.animationJson, // the path to the animation json
    })
    qrAnimeObj.play()

    // if (this.$route.query.token) {
    //   console.log('route', this.$route)
      // this.tableCode = this.$route.fullPath.split('?token=')[1]
    this.tokenProccessor(window.location.href, false)
    // }

    // if user is redirected from link for menu-only there is no need for initial camera
    if (this.storeRedirect) {
      // this.$gtm.trackEvent({
      //   event: 'Menu-Only--hit', // Event type [default = 'interaction'] (Optional)
      //   category: 'menu-only',
      //   action: 'click',
      //   label: this.$route.query.token,
      //   value: 'no-value',
      //   noninteraction: false, // Optional
      // })
    }
  },
  computed: {
    user() {
      return this.$store.state.user.user
    },
    storeRedirect() {
      return this.$store.state.cafe.storeRedirect
    },
    fistTimeCameraActive() {
      return this.$store.state.fistTimeCameraActive
    },
    currentMainPage() {
      return this.$store.state.currentMainPage
    },
    tableScannedToken() {
      // to do : we need to change this to /?token=code insted of ?code
      let token = this.$route.fullPath.split('?token=')[1]
      return token
    },
  },
  watch: {
      // '$route.query.token': (val) => {
      //     if (val) {
      //   console.log('route', this.$route)
      //   this.tokenProccessor(this.$route.fullPath)
      //   }
      // }
    
  },
}
</script>

<style scoped lang="sass">
@import '~/assets/sass/variables.sass'

// .container
</style>