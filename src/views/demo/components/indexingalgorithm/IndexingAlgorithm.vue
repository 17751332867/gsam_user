<template>
  <d2-container style="position: relative;height: 100%">
    <div style="position:relative;width: 400px;border-bottom: #545c64 1px solid;padding-bottom: 5px;height: 50px">
      <el-tag>泛基因组比对</el-tag>
    </div>
    <el-card class="main-content" shadow="always">
      <div class="algorithmSelect">
        选择算法:
        <el-select v-model="indexingName"  @change="handleChange" clearable  filterable style="width: 300px">
          <el-option v-for="item in indexings"
                     :key="item.id"
                     :label="item.name"
                     :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="algorithmCommand">
        <div>
          <el-tag effect="dark">ALGORITHM COMMAND:</el-tag>
        </div>
        <div style="margin-top: 5px">
          <el-tag style="width: 375px">{{ indexing.command }}</el-tag>
        </div>
      </div>
      <div class="algorithmDescription">
        <div>
          <el-tag effect="dark">ALGORITHM DESCRIPTION:</el-tag>
        </div>
        <div style="margin-top: 5px">
          <div style="width: 375px;height: 180px;background-color: rgb(30,144,255,0.1);border-radius: 5px"
               type="textarea">
            <div style="margin-left: 5px;margin-top: 10px;line-height: 25px;color: dodgerblue">
              {{ indexing.description }}
            </div>
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
    </el-card>
  </d2-container>
</template>

<script>
import { baseURL } from '../../../../api/http'
import { selectAllIndexing, submitExperiment } from '../../../../api'
import Cookies from 'js-cookie'

export default {
  name: 'IndexingAlgoritm',
  data () {
    return {
      user: {},
      name: '',
      description: '',
      gfaList: [],
      faList: [],
      indexing: {},
      indexings: [],
      indexingName: ''
    }
  },
  methods: {
    getAllIndexing () {
      selectAllIndexing().then(res => {
        this.indexings = res.data
        console.log(this.indexings)
      })
    },
    handleChange (val) {
      this.indexingName = val.name
      this.indexing = val
    },
    uploadUrl () {
      return baseURL + '/file/upload'
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
    handleExceed () {
      this.$notify({
        title: '超出',
        type: 'error'
      })
    },
    submit () {
      if (this.indexing.id === undefined || this.indexing.id === null) {
        this.$notify({ message: '请选择算法', type: 'error' })
      } else if (this.faList.length === 0 || this.gfaList.length === 0) {
        this.$notify({ message: '请选择gfa和fa文件', type: 'error' })
      } else if (this.name === '' || this.description === '') {
        this.$notify({ message: ' 请输入实验名和描述', type: 'error' })
      } else {
        const experiment = {
          userId: this.user.id,
          name: this.name,
          description: this.description,
          faFile: this.faList[0].id,
          gfaFile: this.gfaList[0].id,
          algorithmId: this.indexing.id
        }
        console.log(experiment)
        submitExperiment(experiment).then(res => {
          if (res.msg === 'success') {
            this.$router.push('/demo/plugins/indexingSuccess/indexingSuccess')
          } else {
            this.$notify({ message: '服务器错误', type: 'error' })
          }
        })
      }
    },
    getUser () {
      let user = Cookies.get('user')
      user = JSON.parse(user)
      this.user = user
    }
  },
  created () {
    this.getAllIndexing()
    this.getUser()
  }
}
</script>

<style scoped>
.submit {
  position: absolute;
  top: 430px;
  left: 600px;
  width: 500px;
}

.description {
  position: absolute;
  top: 170px;
  left: 600px;
  width: 500px;
}

.fileList {
  color: dodgerblue;
  position: absolute;
  top: 50px;
  left: 600px;
  width: 500px;
}

.algorithmDescription {
  position: relative;
  left: 50px;
  top: 120px;
}

.algorithmCommand {
  position: relative;
  left: 50px;
  top: 80px;
  color: dodgerblue;
  font-weight: bold;
}

.algorithmSelect {
  position: relative;
  left: 50px;
  top: 50px;
  color: dodgerblue;
  font-weight: bold;
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
