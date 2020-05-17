<template>
	<div>
		relics
	</div>
</template>

<script>
export default {
	props: {
		requestId: {
			required: true
		}
	},
	data() {
		return {
			relicsData: {
				// 'id': 1, // 文物编号
				// 'name': 'wdnmd', // 文物名称
				// 'count': 2, // 数量
				// 'picturePath': '//files/relics/images/1.jpg', // 照片地址
				// 'year': '南北朝', // 年代
				// 'reign': 'xxx', // 年号
				// 'type': '沙雕', // 器型
				// 'source': 'xxx捐赠', // 来源
				// 'size': '11cm x 45cm x 14cm', // 尺寸
				// 'weight': 19198.10, // 重量 kg
				// 'warehouseId': 1, // 收储仓库id
				// 'place': 'aaa', // 收储地点
				// 'enterPrice': '12345678.90', // 入馆价值【资产科】
				// 'leavePrice': '12345678.90', // 离馆价值【资产科】
				// 'statusId': 1, // 状态id
				// 'lastCheckTime': '2020-04-25 11:11:11', // 最后盘点时间【仓库管理员】
				// 'enterTime': '2020-04-25 11:11:11', // 入馆时间【仓库管理员】
				// 'leaveTime': '2020-04-25 11:11:11', // 离馆时间【仓库管理员】
				// 'moveTime': '2020-04-25 11:11:11', // 移入仓库时间【仓库管理员】
				// 'lendTime': '2020-04-25 11:11:11', // 出借时间【仓库管理员】
				// 'fixTime': '2020-04-25 11:11:11', // 送修时间【仓库管理员】
				// 'updateTime': '2020-04-25 11:11:11', // 更新时间/录入时间
				// 'comment': 'a' // 备注
			}
		}
	}
}
</script>

<style></style>
