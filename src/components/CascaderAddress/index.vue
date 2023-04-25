<template>
  <div>
    <el-select v-model="selectedProvince" placeholder="请选择省" @change="selectProvince">
      <el-option
        v-for="provinceOption in provinceOptions"
        :key="provinceOption.value"
        :label="provinceOption.label"
        :value="provinceOption.value"
      />
    </el-select>
    <el-select v-model="selectedCity" placeholder="请选择市" @change="selectCity">
      <el-option
        v-for="cityOption in cityOptions"
        :key="cityOption.value"
        :label="cityOption.label"
        :value="cityOption.value"
      />
    </el-select>
    <el-select v-model="selectedArea" placeholder="请选择区" @change="selectArea">
      <el-option
        v-for="areaOption in areaOptions"
        :key="areaOption.value"
        :label="areaOption.label"
        :value="areaOption.value"
      />
    </el-select>
  </div>
</template>

<script>
import { fetchAddress } from '@/api/common'
export default {
  props: {
    province: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    area: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      selectedProvince: '',
      selectedCity: '',
      selectedArea: '',
      provinceOptions: [{
        value: '选项1',
        label: '黄金糕',
      }, {
        value: '选项2',
        label: '双皮奶',
      }, {
        value: '选项3',
        label: '蚵仔煎',
      }, {
        value: '选项4',
        label: '龙须面',
      }, {
        value: '选项5',
        label: '北京烤鸭',
      }],
      cityOptions: [{
        value: '选项1',
        label: '黄金糕',
      }, {
        value: '选项2',
        label: '双皮奶',
      }, {
        value: '选项3',
        label: '蚵仔煎',
      }, {
        value: '选项4',
        label: '龙须面',
      }, {
        value: '选项5',
        label: '北京烤鸭',
      }],
      areaOptions: [{
        value: '选项1',
        label: '黄金糕',
      }, {
        value: '选项2',
        label: '双皮奶',
      }, {
        value: '选项3',
        label: '蚵仔煎',
      }, {
        value: '选项4',
        label: '龙须面',
      }, {
        value: '选项5',
        label: '北京烤鸭',
      }],
    }
  },
  created() {
    this.initAddress()
  },
  methods: {
    initAddress() {
      fetchAddress().then((res) => {
        const { data } = res
        this.provinceOptions = data
      })
      if (this.province) {
        const param = {
          id: this.province,
        }
        fetchAddress(param).then((res) => {
          const { data } = res
          this.cityOptions = data
        })
      }
      if (this.city) {
        const param = {
          id: this.city,
        }
        fetchAddress(param).then((res) => {
          const { data } = res
          this.areaOptions = data
        })
      }
    },
    selectProvince(newProvinceId) {
      this.selectedCity = ''
      this.selectedArea = ''
      this.cityOptions = []
      this.areaOptions = []
      this.$emit('selectProvince', this.selectedProvince)
      const param = {
        id: newProvinceId,
      }
      fetchAddress(param).then((res) => {
        const { data } = res
        this.cityOptions = data
      })
    },
    selectCity(newCityId) {
      this.selectedArea = ''
      this.areaOptions = []
      this.$emit('selectCity', this.selectedCity)
      const param = {
        id: newCityId,
      }
      fetchAddress(param).then((res) => {
        const { data } = res
        this.areaOptions = data
      })
    },
    selectArea() {
      this.$emit('selectArea', this.selectedArea)
    },
  },
}
</script>
