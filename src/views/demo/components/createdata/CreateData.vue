<template>
  <d2-container>
    <div id="input" style="width: 40%;height: 400px;position: absolute;left: 50px;top: 50px">
      <div style="position: absolute;top: 0px;left: 0px;width: 40%;">
        <div style="color: dodgerblue;font-size: 25px">节点号</div>
        <div style="color: #aaaaaa">*每行一个节点</div>
        <div style="width: 100%;height: 280px;overflow-y: scroll;border: solid 1px #aaaaaa">
          <el-input
            type="textarea"
            :rows="10000"
            @change="changeChart"
            placeholder="请输入内容"
            v-model="nodestr">
          </el-input>
        </div>
      </div>
      <div style="position: absolute;top: 0px;left: 50%;width: 40%;">
        <div style="color: dodgerblue;font-size: 25px">连接边</div>
        <div style="color: #aaaaaa">*每行两个节点</div>
        <div style="width: 100%;height: 280px;overflow-y: scroll;border: solid 1px #aaaaaa">
          <el-input
            type="textarea"
            :rows="10000"
            @change="changeChart"
            placeholder="请输入内容"
            v-model="edgestr">
          </el-input>
        </div>
      </div>
      <div style="position: absolute;bottom: 0px;left: 0px">
        <el-row>
          <el-col :span="8" style="font-size: 25px">文件名：</el-col>
          <el-col :span="16"><el-input label="文件名" v-model="name"></el-input></el-col>
        </el-row>
      </div>
    </div>
    <div id="chart" style="width:40%;height:400px;position: absolute;left: 50%;top: 50px;border: solid 1px #aaaaaa"></div>
    <el-row style="width: 100%;height: 100px;position: absolute;top: 500px;left: 50px">
        <el-col :span="6">
          <div>read长度:<el-input-number v-model="num" :step="50"></el-input-number></div>
          <div>read个数:<el-input-number v-model="size" :step="10000"></el-input-number></div>
        </el-col>
        <el-col :span="7">
          <div>核心DNA长度下界:<el-input-number v-model="maxLengthLowerBound" :step="100"></el-input-number></div>
          <div>核心DNA长度上界:<el-input-number v-model="maxLengthUpperBound" :step="100"></el-input-number></div>
        </el-col>
        <el-col :span="7">
          <div>附属DNA长度下界:<el-input-number v-model="minLengthLowerBound" :step="100"></el-input-number></div>
          <div>附属DNA长度上界:<el-input-number v-model="minLengthUpperBound" :step="100"></el-input-number></div>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="commit" style="height: 80px">提交</el-button>
        </el-col>
    </el-row>
    <el-dialog
      title="稍等片刻，喝杯茶吧"
      :visible.sync="lock"
      width="30%"
      >
      <span>{{txt}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="lock = false">取 消</el-button>
        <el-button type="primary" @click="download()">确 定</el-button>
      </span>
    </el-dialog>
  </d2-container>
</template>

<script>

import * as echarts from 'echarts'
import { insertPangenomeFile } from '../../../../api'
import Cookies from 'js-cookie'
import { baseURL } from '../../../../api/http'

export default {
  name: 'CreateData',
  data () {
    return {
      resData: {},
      txt: '正在马不停蹄的下载数据',
      lock: false,
      user: {},
      nodestr: '',
      edgestr: '',
      data: [],
      links: [],
      num: 100,
      size: 10000,
      maxLengthLowerBound: 3000,
      maxLengthUpperBound: 5000,
      minLengthLowerBound: 300,
      minLengthUpperBound: 500,
      name: ''
    }
  },
  methods: {
    download () {
      const graphUrl = baseURL + this.resData.graphUrl
      const readUrl = baseURL + this.resData.readUrl
      const resUrl = baseURL + this.resData.resUrl
      this.downloadFile('', graphUrl)
      this.downloadFile('', readUrl)
      this.downloadFile('', resUrl)
      this.lock = false
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
    },
    changeChart () {
      const nodestr = this.nodestr
      this.data = []
      nodestr.split('\n').forEach(res => {
        if (res.length === 0) return
        this.data.push({ name: res })
      })
      const edgestr = this.edgestr
      console.log(edgestr.length)
      this.links = []
      // if (edgestr.length !== 0 || edgestr.split('\n').length === 1) {
      //   this.$notify({message: '一行两个空格隔开', type: 'error'})
      //   return
      // }
      edgestr.split('\n').forEach(res => {
        if (res.length === 0) return
        const tt = res.split(' ')
        console.log(tt)
        const ss = []
        tt.forEach(t => {
          if (t !== '')ss.push(t)
        })
        console.log(ss)
        const source = ss[0]
        const target = ss[1]
        this.links.push({
          source: source,
          target: target,
          name: ''
        })
      })
      this.draw(this.data, this.links)
    },
    draw (chartNode, chartEdge) {
      var myChart = echarts.init(document.getElementById('chart'))
      var option
      option = {
        // 图的标题
        title: {
          text: 'DNA数据图'
        },
        // 提示框的配置
        tooltip: {
          formatter: function (x) {
            return x.data.des
          }
        },
        // 工具箱
        toolbox: {
          // 显示工具箱
          show: true,
          feature: {
            mark: {
              show: true
            },
            // 还原
            restore: {
              show: true
            },
            // 保存为图片
            saveAsImage: {
              show: true
            }
          }
        },
        series: [{
          type: 'graph', // 类型:关系图
          layout: 'force', // 图的布局，类型为力导图
          symbolSize: 40, // 调整节点的大小
          roam: true, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移,可以设置成 'scale' 或者 'move'。设置成 true 为都开启
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [2, 10],
          edgeLabel: {
            normal: {
              textStyle: {
                fontSize: 20
              },
              show: true,
              formatter: function (x) {
                return x.data.name
              }
            }
          },
          force: {
            repulsion: 2500,
            edgeLength: [10, 50]
          },
          draggable: true,
          lineStyle: {
            normal: {
              width: 2,
              color: '#4b565b'
            }
          },
          label: {
            normal: {
              show: true,
              textStyle: {}
            }
          },

          // 数据
          data: chartNode,
          links: chartEdge
        }]
      }
      myChart.setOption(option)
    },
    commit () {
      const user = this.user
      if (this.name.length === 0) {
        this.$notify({ message: '请输入文件名', type: 'error' })
        return
      }
      if (this.data.length === 0) {
        this.$notify({ message: '请输入一个泛基因图', type: 'error' })
        return
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.01)'
      })
      this.lock = true
      this.txt = '正在马不停蹄的下载数据'
      const params = {
        name: this.name,
        userId: user.id,
        data: this.data,
        links: this.links,
        num: this.num,
        size: this.size,
        maxLengthLowerBound: this.maxLengthLowerBound,
        maxLengthUpperBound: this.maxLengthUpperBound,
        minLengthLowerBound: this.minLengthLowerBound,
        minLengthUpperBound: this.minLengthUpperBound
      }
      console.log(params)
      insertPangenomeFile(params).then(res => {
        this.resData = res.data
        loading.close()
        this.txt = '数据造完，是否下载'
      })
    },
    init () {
      const user = Cookies.get('user')
      this.user = JSON.parse(user)
    }
  },
  mounted () {
    this.draw()
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>

</style>
