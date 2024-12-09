<template>
  <div class="home">
    <div class="other"></div>
    <div class="docss">
      <template v-for="key in Object.keys(navGroup)" :key="key">
        <div class="docs">
          <img :src="navGroup[key].icon" />
          <div class="content">{{ navGroup[key].content }}</div>
          <div class="title" @click="goByNavGroup(navGroup[key])">
            {{ navGroup[key].title }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup name="customHome" lang="ts">
// @ts-nocheck
import _ from 'lodash';
import {ref} from "vue";
import navGroupTemp from "./helper/nav-group";
import { useRouter, useData } from "vitepress";
import {getFirstSideBarLink} from "./helper/utils"

const navGroup = ref(_.cloneDeep(navGroupTemp));
const { site, theme } = useData()
const router = useRouter();
const goByNavGroup = (item) => {
  const [firstNav] = item.nav;
  const link = getFirstSideBarLink(firstNav.link, theme.value.sidebar, site.value.base);
  router.go(link);
};
</script>

<style scoped lang="scss">
.home {
  width: 100%;
  max-width: 1024px;
  background-color: rgba($color: #000000, $alpha: 0.01);
  height: 100vh;
  margin: auto;

  .other {
    height: 100px;
  }

  .docss {
    margin: auto;
    display: flex;
    flex-wrap: wrap;

    .docs {
      padding: 0 16px;
      // height: 180px;
      margin-bottom: 20px;
      cursor: pointer;

      img {
        width: 100%;
        border-radius: 4px;
        background-color: rgba($color: #000000, $alpha: 0.1);
      }

      .title {
        text-align: center;
        font-weight: 700;
      }

      .content {
        text-align: center;
        font-size: 13px;
      }
    }

    // 媒体查询：当屏幕宽度小于600px时
    @media screen and (max-width: 600px) {
      .docs {
        width: 50%;

        img {
          height: 90px;
        }
      }
    }

    // 媒体查询：当屏幕宽度在400px到600px之间时
    @media screen and (min-width: 600px) and (max-width: 800px) {
      .docs {
        width: 33%;

        img {
          height: 110px;
        }
      }
    }

    // 媒体查询：当屏幕宽度大于800px时
    @media screen and (min-width: 800px) {
      .docs {
        width: 25%;

        img {
          height: 130px;
        }
      }
    }
  }
}
</style>
