<template>
  <d2-container>
    <el-card class="box-card" v-for="item in benchmark" :key="item.createDate" style="margin-bottom: 10px;position: relative">
      <div style="padding: 0px 100px;font-size: 20px">
        <div>
            <span style="color: dodgerblue">实验名:</span>
            <span style="padding-left: 10px">{{ item.name }}</span>
        </div>
        <div>
            <span style="color: dodgerblue">创建时间:</span>
            <span style="padding-left: 10px">{{item.createDate}}</span>
        </div>
        <div style="height: 60px;overflow: hidden;width: 75%">
          <el-row>
            <el-col :span="2" style="color: dodgerblue">描述:</el-col>
            <el-col :span="22">
              {{item.description}}
            </el-col>
          </el-row>
        </div>
        <div>
          <span style="color: dodgerblue">算法:</span>
          <el-tag v-for="algorithm in item.algorithms" :key="algorithm" style="margin-right: 5px">{{algorithm}}</el-tag>
        </div>
        <div class="status-box">
          <el-tag type="success" size="medium"  effect="dark" v-if="isSuccess(item.status)">完成状态</el-tag>
          <el-tag type="primary" size="medium"   effect="dark" v-if="isWait(item.status)">等待中状态</el-tag>
          <el-tag type="danger" size="medium"  effect="dark" v-if="isRunning(item.status)">运行中状态</el-tag>
          <el-button :disabled="!isSuccess(item.status)" type="info" style="margin-left: 10px" @click="checkOut(item.id)">查看</el-button>
        </div>
      </div>
    </el-card>
  </d2-container>
</template>

<script>
import { selectBenchmarkByUserId } from '../../../../api'
import Cookies from 'js-cookie'

export default {
  name: 'MyBenchMark',
  data () {
    return {
      user: {},
      benchmark: []
    }
  },
  methods: {
    init () {
      let user = Cookies.get('user')
      user = JSON.parse(user)
      this.user = user
      selectBenchmarkByUserId(user.id).then(res => {
        this.benchmark = res.data
        // console.log(res.data)
      })
    },
    isSuccess (status) {
      if (status === '完成') return true
      return false
    },
    isWait (status) {
      if (status === '等待中') return true
      return false
    },
    isRunning (status) {
      if (status === '运行中') return true
      return false
    },
    checkOut (id) {
      this.$router.push({ path: '/demo/playground/benchMarkDetails/benchMarkDetails', query: { benchmarkId: id } })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>
.box-card {
  width: 100%;
  height: 200px;
}
.status-box{
  position: absolute;
  left: 80%;
  top: 75px;
}
</style>
