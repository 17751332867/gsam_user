<template>
  <div>
    <el-table
      :data="indexingExperiments"
      style="width: 100%"
      :row-class-name="tableRowClassName"
      border
    >
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        label="实验名称"
        width="100">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="描述"
            width="200"
            trigger="hover"
            :content="scope.row.description">
            <div slot="reference">{{ scope.row.name }}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="indexing.name"
        width="200"
        label="使用算法">
      </el-table-column>
      <el-table-column
        prop="memory"
        label="内存(kb)"
        width="150">
      </el-table-column>
      <el-table-column
        prop="runningTime"
        label="运行时间(s)"
        width="100">
      </el-table-column>
      <el-table-column
        label="等待中"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag type="success" v-if="isSuccess(scope.row.status)">完成</el-tag>
          <el-tag type="primary" v-if="isWait(scope.row.status)">等待中</el-tag>
          <el-tag type="danger" v-if="isRunning(scope.row.status)">运行中</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button size="small" @click="getInput(scope.row)">输入文件</el-button>
          <el-button size="small" @click="getOutput(scope.row)">输出文件</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { selectExperimentByUserId } from '../../../../api'
import { baseURL } from '../../../../api/http'

export default {
  name: 'MyIndexing',
  data () {
    return {
      user: {},
      indexingExperiments: []
    }
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    init () {
      let user = Cookies.get('user')
      user = JSON.parse(user)
      this.user = user
      selectExperimentByUserId(user.id).then(res => {
        this.indexingExperiments = res.data
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
    getInput (experiment) {
      let fileName = experiment.faFile.name
      let url = baseURL + experiment.faFile.url
      this.downloadFile(fileName, url)
      fileName = experiment.gfaFile.name
      url = baseURL + experiment.gfaFile.url
      console.log(fileName, url)
      this.downloadFile(fileName, url)
    },
    getOutput (experiment) {
      const fileName = experiment.resFile.name
      const url = baseURL + experiment.resFile.url
      this.downloadFile(fileName, url)
    },
    downloadFile (fileName, url) {
      const el = document.createElement('a')
      el.style.display = 'none'
      el.setAttribute('target', '_blank')
      fileName && el.setAttribute('download', fileName)
      el.href = url
      console.log(el)
      document.body.appendChild(el)
      el.click()
      document.body.removeChild(el)
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
