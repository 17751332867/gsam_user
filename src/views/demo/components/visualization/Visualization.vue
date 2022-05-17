<template>
<d2-container>
  <el-row>
    <el-col :span="2">
      <el-upload
        class="upload-demo"
        :action="uploadUrl()"
        :on-success="handleSucess"
        :limit="1"
        auto-upload
        :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">请上传gfa类型文件</div>
      </el-upload>
    </el-col>
    <el-col :span="4">
      <el-button type="info" size="small" @click="submits">生成</el-button>
    </el-col>
  </el-row>
  <img v-for="item in imgs" class="DNA_img" :src="item" :key="item">
  <el-row>
    <el-col :offset="20" :span="4">
      <el-button v-if="imgs.length!=0" @click="beforeSave">保存</el-button>
    </el-col>
  </el-row>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="30%"
    :modal="false"
    :before-close="handleClose">
    <span>{{ msg }}</span>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
  </el-dialog>
  <el-dialog
    title="保存"
    :visible.sync="saveVisible"
    width="30%"
    :modal="false"
    :before-close="handleClose"
  >
    <el-form :model="saveData">
      <el-form-item label="名称" label-width="150">
        <el-input v-model="saveData.name"></el-input>
      </el-form-item>
      <el-form-item label="描述" label-width="150">
        <el-input v-model="saveData.description" type="textArea"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="saveVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSave">确 定</el-button>
    </div>
  </el-dialog>
</d2-container>
</template>

<script>
import { baseURL } from '../../../../api/http'
import { saveVisualization, visualize } from '../../../../api'
import Cookies from 'js-cookie'

export default {
  name: 'visualization',
  data () {
    return {
      saveVisible: false,
      saveData: {
        userId: -1,
        name: '',
        description: '',
        inputId: '',
        outputList: []
      },
      dialogVisible: false,
      fileList: [],
      ids: [],
      websock: {},
      sessionId: '',
      msg: '',
      imgs: []
    }
  },
  methods: {
    handleSave () {
      saveVisualization(this.saveData).then(res => {
        this.$notify.success('保存成功')
      })
      this.saveVisible = false
      this.$router.push({ path: '/demo/plugins/visualizationSuccess/visualizationSuccess' })
    },
    beforeSave () {
      let user = Cookies.get('user')
      user = JSON.parse(user)
      this.saveData.userId = user.id
      this.saveData.inputId = this.ids[0]
      this.imgs.forEach(res => {
        this.saveData.outputList.push(res.replace(baseURL, ''))
      })
      this.saveVisible = true
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    uploadUrl () {
      return baseURL + '/visualization/upload'
    },
    handleSucess (res, file, fileList) {
      console.log(res.data)
      this.ids.push(res.data)
    },
    websockMessage (e) {
      // console.log('监听服务器发送的消息', e.data)
      // 渲染操作
      if (e.data.substring(0, 7) !== ('success')) {
        this.msg = e.data
      } else {
        this.imgs = JSON.parse(e.data.replace('success:', ''))
        const list = []
        this.imgs.forEach(res => {
          res = baseURL + res
          list.push(res)
        })
        this.imgs = list
      }
    },
    submits () {
      this.dialogVisible = true
      let user = Cookies.get('user')
      user = JSON.parse(user)
      if (this.ids.length === 0) {
        this.$notify.error('请先上传文件')
      } else {
        visualize({ id: this.ids[0], userId: user.id }).then(res => {
          res.forEach(e => {
            e = baseURL + e
          })
          this.imgs = res
          console.log(this.imgs)
          this.dialogVisible = false
        }).catch(err => {
          console.log(err)
        })
      }
    },
    init () {
      let user = Cookies.get('user')
      user = JSON.parse(user)
      let host = baseURL + '/messageSocket/' + user.id
      host = host.replace('https', 'ws')
      host = host.replace('http', 'ws')
      console.log(host)
      this.websock = new WebSocket(host)
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
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>
  .DNA_img{
    width: 100%;
  }
</style>
