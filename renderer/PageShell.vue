<template>
	<div id="home">
		<div class="content"><slot /></div>
	</div>
</template>

<style>
	
	body {
		margin: 0;
		--fbc-blue-60: #0060df;
		--fbc-blue-70: #003eaa;
		--fbc-gray-20: #ededf0;
		--fbc-light-gray: #F0F0F4;
		--fbc-white: #ffffff;
		--fbc-transition: all .15s cubic-bezier(.07,.95,0,1);
		--fbc-borders: 1px solid #ededf0;
		--fbc-primary-text: #15141A;
		--fbc-secondary-text: #5B5B66;
		--fbc-font-size: 13px;
	}

	#home {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	#app {
		width: 100vw;
		height: 100vh;
	}

	.content {
		width: 100%;
		height: 100%;
	}

</style>
