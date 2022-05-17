<template>
<div>
  <el-row>
    <el-col :span="8">
      <el-input placeholder="请输入名称" prefix-icon="el-icon-search" v-model="name"></el-input>
    </el-col>
    <el-col :span="8" :offset="1">
      <el-input placeholder="请输入描述关键字" prefix-icon="el-icon-search" v-model="description"></el-input>
    </el-col>
  </el-row>
  <el-row>
    <el-col>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          label="id"
          type="index"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          width="550">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button @click="beforeShow(scope.row)">可视化展示</el-button>
            <el-button>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>

  <div>
    <el-dialog
      title="可视化"
      :visible="dialogVisible"
      :modal="false"
      width="100%"
      :before-close="handleClose">
      <img v-for="item in showData" :src="item" :key="item.id" style="width: 80%;margin: 0px 10%">
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确认</el-button>
      </div>
    </el-dialog>
  </div>
</div>
</template>

<script>
import { selectVisualization, selectVisualizationImgs } from '../../../../api'
import Cookies from 'js-cookie'
import { baseURL } from '../../../../api/http'

export default {
  name: 'MyVisualization',
  data () {
    return {
      description: '',
      name: '',
      tableData: [],
      tempData: [],
      dialogVisible: false,
      showData: []
    }
  },
  watch: {
    name (newName, oldName) {
      this.tableData = []
      this.tempData.forEach(res => {
        if (res.name.indexOf(newName) !== -1 && res.description.indexOf(this.description) !== -1) {
          this.tableData.push(res)
        }
      })
    },
    description (newName, oldName) {
      this.tableData = []
      this.tempData.forEach(res => {
        if (res.name.indexOf(this.name) !== -1 && res.description.indexOf(newName) !== -1) {
          this.tableData.push(res)
        }
      })
    }
  },
  methods: {
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    beforeShow (data) {
      selectVisualizationImgs(data.id).then(res => {
        res.data.forEach(res => {
          this.showData.push(baseURL + res.imgUrl)
        })
      })
      this.dialogVisible = true
    },
    init () {
      let user = Cookies.get('user')
      user = JSON.parse(user)
      this.user = user
      selectVisualization(user.id).then(res => {
        this.tableData = res.data
        this.tempData = res.data
      })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>

</style>
