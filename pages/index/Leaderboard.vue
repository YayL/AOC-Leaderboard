 <template>
	<div id="leaderboard">
		<table id="table">
			<thead id="table-head">
				<tr class="row-head">
					<th class="title" v-for="title in state.titles" 
											 :key="title">
						{{ title }}
					</th>
				</tr>
			</thead>
			<tbody id="table-body">
				<tr class="row-body" v-for="(user, i) in data" :key="i">
					<td class="cell" v-for="(value, name) in user" 
											:key="i + name">
						{{value}}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
 </template>

 <script lang="ts" setup>

	import { reactive } from 'vue'

	const props = defineProps(["data"]);
    let state: any;
    if (props.data !== undefined && props.data[0] !== undefined) {
        state = reactive({ titles: Object.keys(props.data[0])})
    } else {
        state = reactive({ titles: [] })
    }

 </script>

 <style>

	#leaderboard {
		display: flex;
		margin: auto;
		width: 50%;
		justify-content: center;
		align-items: center;
	}

	#table {
		display: flex;
		flex-direction: column;

		width: 90%;
	}

	#table-body, #table-head {
		display: block;
		width: 100%;
	}

	.row-body, .row-head {
		display: flex;

		width: 90%;
		height: 3vh;
		
		color: rgb(205, 205, 225);
	}

	.row-body {
		background-color: rgb(70, 35, 35);
		color: rgb(143, 224, 144);

		font-size: 1.3ch;

		border-radius: 1em;
		margin-bottom: 1.2ch;
	}

	.cell, .title {
		background-color: inherit;
		margin: auto;
		font-weight: bolder;
		font-size: 2ch;
	}

	.cell:first-child, .title:first-child {
		width: 3ch;
		font-size: 2ch;
		margin-left: 5px;
		margin-right: auto;
		font-weight: bold;
	}
	.cell:nth-child(2), .title:nth-child(2) {
		width: 23ch;
		margin-left: 5px;
		margin-right: auto;
		font-weight: bold;
	}

 </style>
