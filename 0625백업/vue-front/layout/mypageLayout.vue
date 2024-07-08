<template>
<div>
    <Header/>
        <div class="content">
            <MyPageMenu></MyPageMenu>
            <router-view></router-view>
        </div>
</div>
</template>

<script>
import MyPageMenu from './mypagemenu.vue';
import Header from './header.vue';

export default {
    name: 'mypage',
    components: {
        MyPageMenu, Header
    }
}
</script>

<style>
</style>