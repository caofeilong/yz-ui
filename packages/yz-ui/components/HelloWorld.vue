<template>
<div>
     hello world
     <about-comp/>
</div>
</template>
<script setup lang="ts">
import { add } from '@yz-ui/utils';
import AboutComp from './AboutComp.vue';

console.info(add(1, 3));
console.info(add(11, 3));
// export default {};
</script>
