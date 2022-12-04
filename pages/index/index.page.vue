<template>
	<div id="background">
		<div id="board">
			<Leaderboard v-for="board in $pageContext.leaderboards" :data="board" :key="board.name" />
		</div>
	</div>
</template>

<script lang="ts" setup>
	
	import { getCurrentInstance } from 'vue'
	import Leaderboard from './Leaderboard.vue'
	const pageContext = getCurrentInstance().appContext.config.globalProperties.$pageContext;

</script>

<style>

	#background {
		display: flex;
		width: 100%;
		height: 100%;
		background-color: rgb(15, 15, 25);
	}

	#board {
		display: flex;
		width: 90%;
		height: 90%;

		margin: auto;
		border-radius: 2ch;
		
		background-color: rgb(21, 20, 33);
	}

</style>
