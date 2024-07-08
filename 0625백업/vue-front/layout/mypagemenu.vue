<template>
    <div class="container">
        <div class="menu">
            <router-link to="/mypage">
                <p class="m">내 정보</p>
            </router-link>

            <router-link to="/mypage/likepage">
                <p class="m">좋아요 목록</p>
            </router-link>

            <router-link to="/mypage/contentpage">
                <p class="m">글 목록</p>
            </router-link>

            <router-link to="/mypage/reviewpage">
                <p class="m">리뷰 목록</p>
            </router-link>

            <router-link to="/mypage/qnapage">
                <p class="m">문의내역</p>
            </router-link>
        </div>
    </div>
    
</template>

<script>
export default {
}
</script>
<style>
.menu {
    background-color: #ccc;
    height: 100%;
    position: fixed;
    width: 120px;

}

.m {
    color: #000000;
    font-size:  16px;
    padding-right: 7px;
    padding-top: 5px;
    margin-right: 1px;
    box-lines: none;
    
    
    
}

</style>