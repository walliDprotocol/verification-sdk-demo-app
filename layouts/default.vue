<template>
  <v-app dark>
    <v-app-bar dark fixed style="background-color: #8080971e">
      <v-toolbar-title>
        <v-img
          :max-width="'140px'"
          contain
          :src="require('@/assets/logo-wallid.png')"
        ></v-img>
      </v-toolbar-title>
      <v-spacer />

      <!-- <ui-connect-btn /> -->

      <nuxt-link :to="'/creator'"> <v-btn> Create </v-btn> </nuxt-link>

      <nuxt-link :to="'/launcher'"><v-btn> Launch</v-btn> </nuxt-link>
    </v-app-bar>
    <v-main>
      <Nuxt />
    </v-main>

    <v-footer dark :absolute="!fixed" style="background-color: #8080971e">
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "mdi-apps",
          title: "Dashboard",
          to: "/",
        },
        {
          icon: "mdi-apps",
          title: "Iframe laucher",
          to: "/launcher",
        },
        {
          icon: "mdi-apps",
          title: "Creator form",
          to: "/creator",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "WalliD WebApp",
    };
  },
};
</script>
<style>
.v-toolbar__content {
  margin: 0 auto;
  max-width: 1200px;
}
</style>
