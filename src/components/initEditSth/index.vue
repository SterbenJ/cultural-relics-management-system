<template>
	<div class="container-vertical-center container-horizontal-center">
		<el-form label-position="left" ref="formRef" :model="formModel" :rules="formRules">
			<el-form-item
				v-for="(value, key) in attrMap"
				:key="key"
				:prop="key"
				:label="value.value"
			>
				<!-- remoteSelect -->
				<el-select
					v-if="value.type === 'remoteSelect'"
					clearable
					:loading="optionsLoadingState[key]"
					v-model="formModel[key]"
					@visible-change="handlerOptionsVisibleChange(arguments, key)"
					@change="handlerSelectChange(arguments, key)"
				>
					<el-option
						v-for="option in options[key]"
						:key="option.id"
						:value="option.id"
						:label="option.name"
					></el-option>
				</el-select>
				<!-- select -->
				<el-select
					v-else-if="value.type === 'Select'"
					clearable
					v-model="formModel[key]"
					@change="handlerSelectChange(arguments, key)"
				>
					<el-option
						v-for="(optionValue, optionKey) in value.selectMap()"
						:key="optionKey"
						:value="optionKey"
						:label="optionValue"
					></el-option>
				</el-select>
				<!-- 其它 -->
				<el-input v-else clearable v-model="formModel[key]"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button style="width: 100%;" type="primary" @click="startBatchEdit">
					开始扫码
				</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
export default {
	props: {
		attrMap: {
			required: true,
			type: Object,
			default: () => {
				return {}
			}
		},
		formRules: {
			required: false,
			type: Object,
			default: () => {
				return {}
			}
		},
		attrRoot: {
			required: true,
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data() {
		return {
			formModel: {},
			optionsLoadingState: {},
			options: {},
			validateState: true
		}
	},
	created() {
		this.initFormModel()
	},
	methods: {
		// 初始化表单
		initFormModel() {
			for (const attrName in this.attrMap) {
				this.initOneAttr(attrName)
			}
		},
		// 初始化额外增加的表单
		initOneAttr(attrName) {
			// 设置初始值
			if (!this.formModel[attrName]) {
				this.$set(this.formModel, attrName, '')
			}
			// 默认必须输入数据
			if (!this.formRules[attrName]) {
				this.formRules[attrName] = [
					{
						required: true,
						message: '不能为空',
						trigger: 'blur'
					}
				]
			}
			// 若为远程加载数据的 select
			if (this.attrMap[attrName].type === 'remoteSelect') {
				// 初始化 options 和 optionsLoadingstateList
				this.$set(this.options, attrName, [])
				this.$set(this.optionsLoadingState, attrName, false)
			}
			// 若有需要额外添加的东西，监听其改变
			const vm = this
			if (this.attrMap[attrName].needOtherAttr) {
				console.log('yes');
				this.$watch(function() {
					return this.formModel[attrName]
				}, function(newVal, oldVal) {
					console.log('watch');
					// 如果旧的值是需要额外新增的，那么取消掉新增的东西
					if (vm.attrMap[attrName].needOtherAttr[oldVal]) {
						for (const name of vm.attrMap[attrName].needOtherAttr[oldVal]) {
							vm.$delete(vm.attrMap, name)
							vm.$delete(vm.formModel, name)
							vm.$delete(vm.formRules, name)
						}
					}
				})
			}
		},
		// 开始批量修改
		async startBatchEdit() {
			await this.touchValidate()
			if (!this.validateState) {
				return
			}
			this.$router.push({ name: 'scanEditInfo', query: this.formModel })
		},
		// 触发表单校验
		touchValidate() {
			const vm = this
			this.$refs.formRef.validate((result, object) => {
				vm.validateState = result
			})
		},
		// 监听 options 显示
		handlerOptionsVisibleChange(args, attrName) {
			// 打开的时候加载远程选项
			const vm = this
			if (args[0]) {
				vm.optionsLoadingState[attrName] = true
				vm.attrMap[attrName]
					.remoteSelectApi(
						vm.attrMap[attrName].selectParent
							? vm.formModel[vm.attrMap[attrName].selectParent]
							: ''
					)
					.then(res => {
						console.log('get ' + attrName + ' options success')
						vm.options[attrName] = res.data.data
						vm.optionsLoadingState[attrName] = false
					})
					.catch(err => {
						console.log('get ' + attrName + ' options fail', err)
						vm.optionsLoadingState[attrName] = false
					})
			}
		},
		// 监听 select 值改变
		handlerSelectChange(args, attrName) {
			// 若有子依赖就清空
			if (this.attrMap[attrName].selectChild) {
				this.formModel[this.attrMap[attrName].selectChild] = ''
				this.options[this.attrMap[attrName].selectChild] = []
			}
			// 有需求的额外参数就渲染
			if (this.attrMap[attrName].needOtherAttr) {
				if (this.attrMap[attrName].needOtherAttr[args[0]]) {
					for (const value of this.attrMap[attrName].needOtherAttr[args[0]]) {
						this.$set(this.attrMap, value, this.attrRoot[value])
					}
					this.initFormModel()
				}
			}
		}
	}
}
</script>

<style></style>
