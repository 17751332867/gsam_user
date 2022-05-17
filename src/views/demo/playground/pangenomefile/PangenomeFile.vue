<template>
  <div>
    <el-table
      border
      :data="pangenomeFileList"
      style="width: 100%"
      :row-class-name="tableRowClassName">
      <el-table-column
        type="index"
        label="id"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称"
        width="180">
      </el-table-column>
      <el-table-column
        width="180"
        label="核心节点">
        <template slot-scope="scope">
          {{scope.row.maxLengthLowerBound}}-{{scope.row.maxLengthUpperBound}}
        </template>
      </el-table-column>
      <el-table-column
        width="180"
        label="附属节点">
        <template slot-scope="scope">
          {{scope.row.maxLengthLowerBound}}-{{scope.row.maxLengthUpperBound}}
        </template>
      </el-table-column>
      <el-table-column
        label="读取"
        width="180"
      >
        <template slot-scope="scope">
          {{scope.row.size}}条长度{{scope.row.num}}的串
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="download(scope.row)">下载</el-button>
          <el-button @click="deleteData(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { deletePangenomeFile, selectPangenomeFile } from '../../../../api'
import { baseURL } from '../../../../api/http'

export default {
  name: 'PangenomeFile',
  data () {
    return {
      user: {},
      pangenomeFileList: []
    }
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'warning-row'
      } else {
        return 'success-row'
      }
    },
    init () {
      let user = Cookies.get('user')
      user = JSON.parse(user)
      this.user = user
      selectPangenomeFile(user.id).then((res) => {
        console.log(res.data)
        this.pangenomeFileList = res.data
      })
    },
    async download (data) {
      await this.downFile('ccc', baseURL + data.resUrl)
      await this.downFile('aaa', baseURL + data.graphUrl)
      await this.downFile('bbb', baseURL + data.readUrl)
    },
    downFile (fileName, url) {
      const el = document.createElement('a')
      el.style.display = 'none'
      el.setAttribute('target', '_blank')
      fileName && el.setAttribute('download', fileName)
      el.href = url
      document.body.appendChild(el)
      el.click()
      document.body.removeChild(el)
    },
    async deleteData (data) {
      // console.log(data)
      await deletePangenomeFile(data.id).then(res => {
        this.$notify({ message: ' 删除成功', type: 'success' })
      })
      await this.init()
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>
.box-card{
  margin: 20px 0px;
}
.warning-row {
  background: oldlace;
}

.success-row {
  background: #f0f9eb;
}
</style>
