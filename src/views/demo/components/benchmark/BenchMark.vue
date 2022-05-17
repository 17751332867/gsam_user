<template>
  <d2-container class="pane" style="position: relative;height: 100%">
    <div style="position:relative;width: 400px;border-bottom: #545c64 1px solid;padding-bottom: 5px;height: 40px;font-weight: bold;">
      <el-tag>benchMark</el-tag>
    </div>
    <el-card class="main-content" shadow="always">
      <div class="select-box">
        <div style="width: 300px;border-bottom: solid 1px #aaaaaa;padding-bottom: 5px;color: dodgerblue">请选择</div>
        <div style="margin: 10px 0px">
          <el-select v-model="indexingName"  @change="handleChange" clearable  filterable style="width: 250px">
            <el-option v-for="item in indexings"
                       :key="item.id"
                       :label="item.name"
                       :value="item">
            </el-option>
          </el-select>
          <el-button type="primary" @click="addIndexing">添加</el-button>
        </div>
        <div style="width: 350px;">
          <div style="width: 300px;padding: 10px 0px;color: dodgerblue;font-weight: bold;">已选择的算法:</div>
          <div style="border: solid 1px #dddddd;width: 350px;height: 200px;border-radius: 5px">
            <el-tag
              :key="tag.id"
              v-for="tag in selected"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)">
              {{tag.name}}
            </el-tag>
          </div>
        </div>
      </div>
      <div class="fileList">
        <div style="margin-top: 10px;width: 100%">
          <el-row>
            <el-col :span="8">
              <div></div>
              <el-upload
                ref="upload"
                multiple
                :limit="1"
                class="upload-demo"
                :action="uploadUrl()"
                :on-success="handleUploadFa"
                :file-list="faList"
                :on-exceed="handleExceed"
              >
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <div slot="tip" class="el-upload__tip">请上传fa类型文件,避免不必要的错误</div>
              </el-upload>
            </el-col>
            <el-col :span="8" :offset="4">
              <el-upload
                ref="upload"
                multiple
                :limit="1"
                class="upload-demo"
                :action="uploadUrl()"
                :on-success="handleUploadGfa"
                :file-list="gfaList"
                :on-exceed="handleExceed"
              >
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <div slot="tip" class="el-upload__tip">请上传gfa类型文件,避免不必要的错误</div>
              </el-upload>
            </el-col>
          </el-row>
        </div>
        <div class="description">
          <div style="margin: 10px 0px">
            <span><el-tag>实验名:</el-tag></span>
            <span><el-input v-model="name" style="width: 400px"></el-input></span>
          </div>
          <el-tag style="margin: 10px 0px">实验描述</el-tag>
          <el-input type="textarea" :rows="5" v-model="description">
          </el-input>
        </div>
        <div class="submit">
          <el-button style="margin-left: 20%;width: 20%">重置</el-button>
          <el-button style="margin-left: 20%;width: 20%" @click="submit">提交</el-button>
        </div>
      </div>
   </el-card>
  </d2-container>
</template>

<script>
import Cookies from 'js-cookie'
import { selectAllIndexing, submitIndexingBenchmark } from '../../../../api'
import { baseURL } from '../../../../api/http'

export default {
  name: 'BenchMark',
  data () {
    return {
      name: '',
      description: '',
      user: {},
      gfaList: [],
      faList: [],
      indexings: [],
      indexing: {},
      indexingName: '',
      selected: []
    }
  },
  methods: {
    handleExceed () {
      this.$notify({
        title: '超出',
        type: 'error'
      })
    },
    handleUploadFa (res, file, fileList) {
      console.log(res)
      this.faList.push(res.data)
      this.$notify({
        title: '上传成功',
        type: 'success'
      })
    },
    handleUploadGfa (res, file, fileList) {
      console.log(res)
      this.gfaList.push(res.data)
      this.$notify({
        title: '上传成功',
        type: 'success'
      })
    },
    uploadUrl () {
      return baseURL + '/file/upload'
    },
    addIndexing () {
      if (this.indexingName === '' || this.indexingName === null || this.indexing === '') {
        this.$notify({ type: 'error', message: '请选择' })
      } else if (this.selected.indexOf(this.indexing) !== -1) {
        this.$notify({ type: 'error', message: '已选择' })
      } else {
        this.selected.push(this.indexing)
      }
    },
    handleClose (tag) {
      this.selected.splice(this.selected.indexOf(tag), 1)
    },
    handleChange (val) {
      this.indexingName = val.name
      this.indexing = val
    },
    getAllIndexing () {
      selectAllIndexing().then(res => {
        this.indexings = res.data
        console.log(this.indexings)
      })
    },
    getUser () {
      let user = Cookies.get('user')
      user = JSON.parse(user)
      this.user = user
    },
    submit () {
      if (this.indexing.id === undefined || this.indexing.id === null) {
        this.$notify({ message: '请选择算法', type: 'error' })
      } else if (this.faList.length === 0 || this.gfaList.length === 0) {
        this.$notify({ message: '请选择gfa和fa文件', type: 'error' })
      } else if (this.name === '' || this.description === '') {
        this.$notify({ message: ' 请输入实验名和描述', type: 'error' })
      } else {
        const algorithms = []
        for (let i = 0; i < this.selected.length; i++) {
          algorithms.push(this.selected[i].id)
        }
        const benchmark = {
          name: this.name,
          description: this.description,
          userId: this.user.id,
          faFile: this.faList[0].id,
          gfaFile: this.gfaList[0].id,
          algorithms: algorithms
        }
        submitIndexingBenchmark(benchmark).then(res => {
          if (res.data === 'success') {
            this.$router.push({ path: '/demo/plugins/benchmarkSuccess/benchmarkSuccess' })
          }
        })
      }
    }
  },
  created () {
    this.getAllIndexing()
    this.getUser()
  }
}
</script>

<style scoped>
.submit{
  margin-top: 10px;
}

.fileList {
  color: dodgerblue;
  position: absolute;
  top: 50px;
  left: 600px;
  width: 500px;
}

.select-box{
  position: relative;
  top: 10px;
  left: 50px;
}

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
