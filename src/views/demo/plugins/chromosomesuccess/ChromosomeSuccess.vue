<template>
  <d2-container class="pane" style="position: relative;height: 100%">
    <div style="position:relative;width: 400px;border-bottom: #545c64 1px solid;padding-bottom: 5px;height: 50px">
      <el-tag>泛基因组比对</el-tag>
    </div>
    <el-card class="main-content" shadow="always">
      <el-result icon="success" title="保存成功" subTitle="进入我的读取生成快读取文件">
        <template slot="extra">
          <el-button type="primary" size="medium">返回主页</el-button>
          <el-button type="primary" size="medium" @click="toMyChromosome">我的数据提取</el-button>
        </template>
      </el-result>
    </el-card>
  </d2-container>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  name: 'ChromosomeSuccess',
  data () {
    return {
      user: {},
      name: '',
      description: '',
      gfaList: [],
      faList: [],
      indexing: {},
      indexings: []
    }
  },
  methods: {
    getUser () {
      let user = Cookies.get('user')
      user = JSON.parse(user)
      this.user = user
    },
    toMyChromosome () {
      this.$router.push({ path: '/demo/playground/myChromosome/myChromosome' })
    }
  },
  created () {
    this.getUser()
  }
}
</script>

<style scoped>
.pane {
  position: center;
  height: 100%;
}

.main-content {
  position: relative;
  margin-top: 5px;
  height: 500px;
  line-height: 100%;
}
</style>
