<template>
  <d2-container>
    <el-row style="height: 120px">
      <el-col>
        <el-upload
          class="upload-demo"
          :action="uploadMethod()"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :on-success="handleUpload"
          multiple
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <el-button size="small" type="primary" @click.stop="product()">生成</el-button>
          <el-button size="small" type="primary" @click.stop="scanFile()">扫描</el-button>
          <div slot="tip" class="el-upload__tip">只能上传gfa/rgfa文件</div>
        </el-upload>
      </el-col>
    </el-row>
    <el-row>
      <el-card style="height: 400px">
        <el-col :span="12">
          <el-transfer
            width="800px"
            filterable
            filter-placehhandleUploadolder="请输入染色体名称"
            v-model="value"
            :data="data">
          </el-transfer>
        </el-col>
        <el-col :span="12">
          <div style="width: 100%;margin-top: auto;border: solid 1px;height: 300px;border-radius: 10px;overflow-y: scroll">
            <el-row>
              <el-col :offset="1" :span="item.length/3+2" v-for="item in result" :key="item" style="height: 100px">
                <el-button style="margin-top: 10px" type="primary">{{item}}</el-button>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-card>
    </el-row>
    <el-row style="margin-top: 50px">
      <el-progress :percentage="percentage" :color="customColor" :stroke-width="24"></el-progress>
    </el-row>
    <el-row>
      <el-col :offset="18" :span="6" style="margin-top: 20px" v-show="visiable">
        <el-button @click="saveRes">保存</el-button>
        <el-button @click="reset">重置</el-button>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>
import { baseURL } from '../../../../api/http'
import Cookies from 'js-cookie'
import { insertChromosomes, scan } from '../../../../api'
import { Loading } from 'element-ui'
export default {
  name: 'Chromosome',
  data () {
    return {
      websocket: null,
      mapper: {},
      visiable: false,
      value: [],
      data: [],
      fileList: [],
      result: [],
      fileId: -1,
      // percentage: 20,
      customColor: '#409eff',
      customColors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ]
    }
  },
  computed: {
    percentage () {
      if (this.result.length === this.value.length && this.result.length !== 0) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.visiable = true
      }
      if (this.value.length === 0) return 0
      else return (this.result.length / this.value.length * 100).toFixed(1)
    }
  },
  methods: {
    saveRes () {
      let user = Cookies.get('user')
      user = JSON.parse(user)
      const res = {
        userId: user.id,
        fileId: this.fileId,
        list: []
      }
      this.result.forEach(d => {
        res.list.push(this.mapper[d])
      })
      insertChromosomes(res).then(res => {
        this.$notify.success('保存成功')
        this.$router.push({ path: '/demo/plugins/chromosomeSuccess/chromosomeSuccess' })
      })
    },
    reset () {
      this.mapper = {}
      this.value = []
      this.data = []
      this.fileList = []
      this.result = []
      this.fileId = -1
      this.visiable = false
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    scanFile () {
      if (this.fileId === -1) {
        this.$notify.error('请先上传文件')
        return
      }
      this.data = []
      const loadingInstance1 = Loading.service(
        // eslint-disable-next-line standard/object-curly-even-spacing
        { fullscreen: true, text: '扫描文件中请稍后' }
      )
      this.dialogVisible = true
      scan(this.fileId).then(res => {
        res.data.forEach(d => {
          this.data.push({ label: d.dna + '(' + d.cycle + ')', key: d.id })
          this.mapper[d.dna] = d
        })
        loadingInstance1.close()
        this.dialogVisible = false
      })
    },
    init () {
      let user = Cookies.get('user')
      user = JSON.parse(user)
      let host = baseURL + '/chromosome/' + user.id
      host = host.replace('https', 'ws')
      host = host.replace('http', 'ws')
      console.log(host)
      this.websock = new WebSocket(host)
      // console.log(this.websock)
      // 监听打开
      this.websock.onopen = (Session) => {
        console.log('开始监听', Session.data)
      }
      // 监听关闭
      this.websock.onclose = () => {
        console.log('关闭监听')
      }
      this.websock.onerror = () => {
        console.log('error')
      }
      this.websock.onmessage = this.websockMessage
    },
    websockMessage (e) {
      // console.log(e)
      const res = JSON.parse(e.data)
      this.mapper[res[0]].url = res[1]
      this.result.push(res[0])
    },
    product () {
      if (this.fileId === -1) {
        this.$notify.error('请先上传文件')
        return
      }
      if (this.value.length === 0) {
        this.$notify.error('请先选择')
        return
      }
      const chromosome = {
        id: this.fileId,
        list: []
      }
      // console.log(this.value)
      this.value.forEach(res => {
        chromosome.list.push(res)
      })
      this.websock.send(JSON.stringify(chromosome))
    },
    handleUpload (res, file, fileList) {
      this.fileId = res.data.id
    },
    uploadMethod () {
      return baseURL + '/file/upload'
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>

</style>
