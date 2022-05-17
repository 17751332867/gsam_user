<template>
  <d2-container style="position: relative;height: 100%">
    <div style="position:relative;width: 400px;border-bottom: #545c64 1px solid;padding-bottom: 5px;height: 50px">
      <el-tag>泛基因组比对</el-tag>
    </div>
    <el-card class="main-content" shadow="always">
      <el-result icon="success" title="benchmark上传成功" subTitle="实验可能要很久请耐心等待">
        <template slot="extra">
          <el-button type="primary" size="medium">返回主页</el-button>
          <el-button type="primary" size="medium" @click="toMyIndexing">我的BenchMark</el-button>
        </template>
      </el-result>
    </el-card>
  </d2-container>
</template>

<script>
export default {
  name: 'BenchMarkSuccess',
  methods: {
    toMyIndexing () {
      this.$router.push({ path: '/demo/playground/myBenchMark/myBenchMark' })
    }
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
