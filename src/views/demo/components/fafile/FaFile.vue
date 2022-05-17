<template>
  <d2-container>
    <div>
      <el-row>
        <el-col :span="7" :offset="1" v-for="item in tableData" :key="item.id">
          <el-card v-if="item.fileList!=null">
            <div slot="header" class="clearfix">
              <span>{{item.fileList.name}}</span>
            </div>
            <div slot="default">
              大小:{{item.size/1000}}kb
            </div>
            <div>简述:{{item.description}}</div>
            <el-footer style="height: 50px;margin: auto">
              <el-row>
                <el-col :span="4">
                  <i class="el-icon-document" style="font-size: 35px"></i>
                </el-col>
                <el-col :span="20">
                  <el-button style="width: 100%;font-size: 15px" type="primary" @click="downFile(item)">
                    <i class="el-icon-download" ></i>下载
                  </el-button>
                </el-col>
              </el-row>

            </el-footer>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="正在下载，请等待" :visible.sync="fileDown.loadDialogStatus" :close-on-click-modal="false"
               :close-on-press-escape="false" :show-close="false" width="20%" :modal="false">
      <div style="text-align: center;">
        <el-progress type="circle" :percentage="fileDown.percentage"></el-progress>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="downClose">取消下载</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import axios from 'axios'
import { baseURL } from '../../../../api/http'
import { selectAllData } from '../../../../api'

export default {
  name: 'FaFile',
  data () {
    return {
      tableData: [],
      fileDown: {
        loadDialogStatus: false, // 弹出框控制的状态
        percentage: 0, // 进度条的百分比
        source: {} // 取消下载时的资源对象
      }
    }
  },
  methods: {
    downFile (row) {
      // 这里放参数
      var param = { file: row.fileList.url }
      this.fileDown.loadDialogStatus = true
      this.fileDown.percentage = 0
      const instance = this.initInstance()
      instance({
        method: 'post',
        withCredentials: true,
        url: baseURL + '/data/download',
        params: param,
        responseType: 'blob',
        timeout: 3600 * 1000 * 10
      }).then(res => {
        this.fileDown.loadDialogStatus = false
        console.info(res)
        const content = res.data
        if (content.size === 0) {
          this.loadClose()
          this.$alert('下载失败')
          return
        }
        const blob = new Blob([content])
        const fileName = row.fileList.name// 替换文件名
        if ('download' in document.createElement('a')) {
          // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          setTimeout(function () {
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          }, 100)
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      }).catch(error => {
        this.fileDown.loadDialogStatus = false
        console.info(error)
      })
    },
    initInstance () {
      var _this = this
      // 取消时的资源标记
      this.fileDown.source = axios.CancelToken.source()
      const instance = axios.create({
        onDownloadProgress: function (ProgressEvent) {
          const load = ProgressEvent.loaded
          const total = ProgressEvent.total
          const progress = (load / total) * 100
          console.log('progress=' + progress)
          // 一开始已经在计算了 这里要超过先前的计算才能继续往下
          if (progress > _this.fileDown.percentage) {
            _this.fileDown.percentage = Math.floor(progress)
          }
          if (progress === 100) {
            // 下载完成
            _this.fileDown.loadDialogStatus = false
          }
        },
        cancelToken: this.fileDown.source.token// 声明一个取消请求token
      })
      return instance
    },
    downClose () {
      this.fileDown.source.cancel('log==客户手动取消下载')
    },
    getAllData () {
      selectAllData().then(res => {
        this.tableData = res.data
        console.log(this.tableData)
      })
    }
  },
  mounted () {
    this.getAllData()
  }
}
</script>

<style scoped>

</style>
