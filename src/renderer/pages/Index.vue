<template>
  <main>
    <notifications class="notifications" />
    <statistics class="statistics" />
  </main>
</template>

<script>
import Notifications from '@/pages/Index/Notifications';
import Statistics from '@/pages/Index/Statistics';

export default {
  components: { Notifications, Statistics },
};
</script>

<style scoped lang="sass">
@import '../sass/_shared.sass'

main
  width: 960px
  margin: 0 auto
  font-size: 0
</style>
