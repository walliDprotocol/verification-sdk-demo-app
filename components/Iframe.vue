<template>
    <transition name="modal-fade">
      <div class="modal-backdrop">
        <div
          class="modal-kyc"
          role="dialog"
          aria-labelledby="modalTitle"
          aria-describedby="modalDescription"
          @click.stop
        >
          <header id="modalTitle" class="modal-header identity-proof">
            <slot name="header">
              <button
                type="button"
                class="btn-close"
                aria-label="Close modal"
                @click="close"
              >
              </button>
            </slot>
          </header>
          <iframe
            :src="shuftiProUrl"
            frameborder="0"
            allowtransparency="true"
            width="900px"
            height="650px"
            style="overflow: hidden"
            allow="camera"
          ></iframe>
        </div>
      </div>
    </transition>
  </template>
  
  <script>
  
  export default {
    name: 'ShuftiProModal',
    props: {
      addEventListener: {
        type: String,
        default: '',
      },
    },
  
    data() {
      return {
        shuftiProUrl : "https://sdk-iframe.herokuapp.com/"
      }
    },
    mounted() {},
    methods: {
      close() {
        this.$emit('close')
      },
    },
  }
  </script>
  
  <style lang="scss">
  .modal-kyc {
    .modal-header {
      display: block !important;
      height: auto !important;
      border: none !important;
    }
    .btn-close {
      position: relative;
      float: right;
      margin: auto;
      margin-right: 0;
      right: 4px;
      top: 22px;
      svg {
        width: 10px;
        height: 10px;
      }
    }
  }

  .modal-backdrop {
    z-index: 1060;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
    overflow-x: auto;
  }
  
  .modal-wallid {
    max-width: 830px;
    min-width: 300px;
    margin: 0px auto;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    font-family: Helvetica, Arial, sans-serif;
  
    .v-stepper {
      box-shadow: none;
    }
  
    .v-btn.next {
      border-radius: 4px;
      background-color: var(--teal-blue) !important;
      color: #ffffff;
      box-shadow: none;
      width: 150px;
      height: 44px;
      span {
        text-transform: none;
        font-size: 15px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: center;
        color: var(--white);
      }
    }
  
    .v-btn.back {
      border-radius: 4px;
      background-color: #ffffff !important;
      color: var(--teal-blue) !important;
      box-shadow: none;
      height: 44px;
      padding: 0 36px;
      border: solid 1px var(--teal-blue);
      span {
        text-transform: none;
        font-size: 15px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: center;
        color: var(--teal-blue) !important;
      }
    }
  
    .modal-body {
      padding: 0px 6px 0px 18px;
    }
  
    #modalTitle.modal-header {
      padding: 20px 30px;
      border-bottom: solid 1px #d8d8d8;
      font-family: Montserrat;
      font-size: 18px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: var(--charcoal-grey);
    }
  
    .modal-footer {
      border-top: solid 1px #d8d8d8;
    }
    .modal-footer,
    .modal-header {
      padding: 10px 30px;
      display: flex;
      flex-wrap: wrap;
    }
  
    .btn-close {
      border: none;
      cursor: pointer;
      font-weight: bold;
      color: #092e33;
      background: transparent;
    }
  
    .dont-show {
      font-size: 13px !important;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.85;
      letter-spacing: normal;
      text-align: center;
      color: #a9a9a9 !important;
      margin-top: 48px;
      margin-bottom: 0px !important;
      cursor: pointer;
    }
  }
  .modal-fade-enter,
  .modal-fade-leave-active {
    opacity: 0;
  }
  
  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.5s ease;
  }
  </style>