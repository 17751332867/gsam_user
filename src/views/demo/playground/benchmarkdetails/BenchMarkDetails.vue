<template>
  <d2-container>
    <div>
      <span class="label">名称: </span>
      <el-tag>{{ benchmark.name }}</el-tag>
    </div>
    <div>
      <span class="label">状态: </span>
      <el-tag size="medium"   v-if="isSuccess(benchmark.status)">完成状态</el-tag>
      <el-tag size="medium"   v-if="isWait(benchmark.status)">等待中状态</el-tag>
      <el-tag size="medium"   v-if="isRunning(benchmark.status)">运行中状态</el-tag>
    </div>
    <div>
      <span class="label">描述: </span>
      <el-tag size="medium">
        {{benchmark.description}}
      </el-tag>
    </div>
    <div>
      <span class="label">运行结果:</span>
      <el-table
        :data="benchmark.indexingBenchmarkResults"
        border
        align="center"
        style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="cpu"
          label="cpu占比(%)"
          width="180">
        </el-table-column>
        <el-table-column
          prop="memory"
          label="内存(kb)">
        </el-table-column>
        <el-table-column prop="realTime" label="运行时间(s)">

        </el-table-column>
        <el-table-column label="下载运行结果">
          <template slot-scope="scope">
            <el-button type="primary" plain @click="downLoad(scope.row.resFile)"><i class="el-icon-download"></i>下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="position: relative">
      <div style="position: absolute;border: solid black 1px;width: 40%;height: 400px" id="realTime"></div>
      <div style="position: absolute;border: solid black 1px;width: 40%;height: 400px;left: 50%;top: 0px" id="memory"></div>
      <div style="position: absolute;border: solid black 1px;width: 40%;height: 400px;top: 400px" id="cpu"></div>
    </div>
  </d2-container>
</template>

<script>
import {getIndexingBenchmarkchartInfo, selectBenchmarkById} from '../../../../api'
import * as echarts from 'echarts'
import {baseURL} from '../../../../api/http'
export default {
  name: 'BenchMarkDetails',
  data () {
    return {
      benchmarkId: '',
      benchmark: {},
      chartInfo: {}
    }
  },
  methods: {
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
    init () {
      let benchmarkId = this.$route.query.benchmarkId
      this.benchmarkId = benchmarkId
      selectBenchmarkById(benchmarkId).then(res => {
        this.benchmark = res.data
      })
      getIndexingBenchmarkchartInfo(benchmarkId).then(res => {
        this.chartInfo = res.data
        this.drawMemory(res.data)
        this.drawRealTime(res.data)
        this.drawCPU(res.data)
      })
    },
    drawMemory (chartInfo) {
      let myChart = echarts.init(document.getElementById('memory'))
      let option
      option = {
        title: [
          {
            text: 'memories(kb)'
          }
        ],
        xAxis: {
          type: 'category',
          data: chartInfo.name
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: chartInfo.memory,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
      }

      option && myChart.setOption(option)
    },
    drawRealTime (chartInfo) {
      let myChart = echarts.init(document.getElementById('realTime'))
      let option
      option = {
        title: [
          {
            text: 'realTime(s)'
          }
        ],
        xAxis: {
          type: 'category',
          data: chartInfo.name
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: chartInfo.realTime,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
      }

      option && myChart.setOption(option)
    },
    downLoad (res) {
      let fileName = res.name
      let url = baseURL + res.url
      this.downloadFile(fileName, url)
      console.log(res)
    },
    drawCPU (chartInfo) {
      var chartDom = document.getElementById('cpu')
      var myChart = echarts.init(chartDom)
      var option

      option = {
        title: {
          text: 'cpus',
          subtext: 'usage of cpu(%)',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: chartInfo.cpu,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }

      option && myChart.setOption(option)
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
  },
  mounted () {
  }
}
</script>

<style scoped>
.label {
  color: coral;
}
</style>
