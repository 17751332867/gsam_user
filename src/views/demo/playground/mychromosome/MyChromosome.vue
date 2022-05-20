<template>
  <d2-container>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      :row-class-name="tableRowClassName">
      <el-table-column
        type="index"
        width="80">
      </el-table-column>
      <el-table-column
        prop="name"
        label="染色体名称"
        width="200">
      </el-table-column>
      <el-table-column
        prop="originName"
        label="源文件名"
        width="180">
      </el-table-column>
      <el-table-column
        label="是否有环"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.cycle==='Looped'">有环</el-tag>
          <el-tag type="success" v-else>无环</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="节点总数"
        prop="tot"
        width="100"
      >
      </el-table-column>
      <el-table-column
        label="文件大小(byte)"
        prop="fileSize"
        width="120"
      >
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="createTime"
        width="200"
      >
      </el-table-column>
      <el-table-column
        label="状态"
        property="status"
        fixed="right"
        width="120"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==='未生成序列'" type="info">{{scope.row.status}}</el-tag>
          <el-tag v-if="scope.row.status==='生成中'" type="danger">{{scope.row.status}}</el-tag>
          <el-tag v-if="scope.row.status==='完成'" type="success">{{scope.row.status}}</el-tag>
          <el-tag v-if="scope.row.status==='排队中'" type="text">{{scope.row.status}}</el-tag>
        </template>
        <el-tag></el-tag>
      </el-table-column>
      <el-table-column label="序列长度">
        <template slot-scope="scope">
          <span v-if="scope.row.length===null">
            尚未生成
          </span>
          <span v-else>{{ scope.row.length }}</span>
        </template>
      </el-table-column>
      <el-table-column label="序列个数">
        <template slot-scope="scope">
          <span v-if="scope.row.size===null">
            尚未生成
          </span>
          <span v-else>{{ scope.row.size }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="300px"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.status==='未生成序列'" type="info" @click="beforeProduct(scope.row.id)">生成</el-button>
          <el-button v-if="scope.row.status==='完成'" type="primary" @click="download(scope.row)">下载数据</el-button>
          <el-button @click="beforeDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="生成文件尺寸" :visible.sync="productVisiable" style="width: 50%;margin: auto" :modal="false">
      <el-form>
        <el-form-item label="单个序列长度" label-width="100px">
          <el-input-number v-model="product.length" :step="100"></el-input-number>
        </el-form-item>
        <el-form-item label="序列个数" label-width="100px">
          <el-input-number v-model="product.size" :step="1000000"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="productVisiable = false">取 消</el-button>
        <el-button type="primary" @click="handleProduct">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="deleteVisible"
      width="30%"
      :before-close="handleClose">
      <span>你确定要删除用户:{{deleteChromosome.name}}吗</span>
      <span slot="footer" class="dialog-footer">
                <el-button @click="deleteVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleDeleteChromosome">确 定</el-button>
            </span>
    </el-dialog>
  </d2-container>
</template>

<script>
import Cookies from 'js-cookie'
import { deleteChromosomeById, productFa, selectChromosomesByUserId } from '../../../../api'
import { baseURL } from '../../../../api/http'

export default {
  name: 'MyChromosome',
  data () {
    return {
      deleteVisible: false,
      deleteChromosome: {

      },
      productVisiable: false,
      user: null,
      tableData: [],
      product: {
        userId: -1,
        id: -1,
        length: 200,
        size: 1000000
      }
    }
  },
  methods: {
    handleDeleteChromosome () {
      deleteChromosomeById(this.deleteChromosome.id).then(res => {
        this.init()
        this.$notify.success('删除成功')
        this.deleteVisible = false
      })
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    },
    beforeDelete (data) {
      this.deleteChromosome = data
      this.deleteVisible = true
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
    download (row) {
      this.downFile(row.name, baseURL + row.chromosomeUrl)
      this.downFile('read' + row.length + '.fa', baseURL + row.faUrl)
    },
    async handleProduct () {
      await productFa(this.product).then(res => {
        this.$notify.success('已进入排队')
      })
      this.productVisiable = false
      this.init()
    },
    beforeProduct (id) {
      this.product.userId = this.user.id
      this.product.id = id
      this.productVisiable = true
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'warning-row'
      } else {
        return ''
      }
    },
    init () {
      let user = Cookies.get('user')
      user = JSON.parse(user)
      this.user = user
      console.log(this.user)
      selectChromosomesByUserId(user.id).then(res => {
        this.tableData = res.data
      })
    }
  },
  created () {
    this.init()
    setInterval(this.init, 60000)
  }
}
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
