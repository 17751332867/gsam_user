import { get, post } from './http'

export const login = (params) => get('user/login', params)

export const selectAllIndexing = () => get('indexing/selectAll')

export const submitExperiment = (params) => post('indexingExperiment/doExperiment', params)

export const selectExperimentByUserId = (id) => get(`indexingExperiment/selectByUserId?id=${id}`)

export const submitIndexingBenchmark = (params) => post('benchmark/doBanchmark', params)

export const selectBenchmarkByUserId = (id) => get(`benchmark/selectByUserId?userId=${id}`)

export const selectBenchmarkById = (id) => get(`benchmark/selectById?id=${id}`)

export const getIndexingBenchmarkchartInfo = (id) => get(`benchmark/getChartInfo?id=${id}`)

export const insertPangenomeFile = (params) => post('PangenomeFile/insert', params)

export const selectAllData = () => get('data/selectAll')

export const visualize = (params) => post('visualization/visualize', params)

export const selectPangenomeFile = (id) => get(`PangenomeFile/selectByUserId?userId=${id}`)

export const deletePangenomeFile = (id) => get(`PangenomeFile/delete?id=${id}`)

export const saveVisualization = (params) => post('visualization/save', params)

export const selectVisualization = (id) => get(`/visualization/selectByUserId?userId=${id}`)

export const selectVisualizationImgs = (id) => get(`/visualization/selectVisualizationImgs?id=${id}`)

export const scan = (id) => get(`/chromosome/scanFile?id=${id}`)

export const insertChromosomes = (params) => post('chromosome/insertChromosomes', params)

export const selectChromosomesByUserId = (id) => get(`chromosome/selectChromosomesByUserId?id=${id}`)

export const productFa = (params) => get('chromosome/productFa', params)

export const deleteChromosomeById = (id) => get(`chromosome/delete?id=${id}`)
