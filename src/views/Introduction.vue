<template>
	<div class="view Introduction">
		<h1 class="title">{{ AppName }}</h1>
		<div class="typewriter">
			<h1>Write a threejs app using vuejs and typescript.</h1>
		</div>
		<div class="time">{{ time }}</div>
	</div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
	setup(props, ctx) {
		let AppName = ref<string>('');
		let timer = ref<any>();
		let time = ref<number>(5);
		return {
			AppName,
			timer,
			time,
		};
	},
	created() {
		this.AppName = process.env.VUE_APP_NAME as string;
		this.timer = setInterval(() => {
			if (this.time === 1) {
				this.$router.replace('/chapter-01/1');
				clearInterval(this.timer);
			} else {
				this.time -= 1;
			}
		}, 1000);
	},
});
</script>
<style lang="scss" scoped>
$timeFontSize: 30px;

@keyframes gradientBG {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}

@keyframes typing {
	from {
		width: 0;
	}
	to {
		width: 100%;
	}
}

@keyframes blink-caret {
	from,
	to {
		border-color: transparent;
	}
	50% {
		border-color: orange;
	}
}

@keyframes timer {
	0% {
		font-size: 0;
	}
	50% {
		font-size: $timeFontSize;
		transform: scale(2);
	}
	100% {
		font-size: 0;
	}
}

.Introduction {
	position: relative;
	text-align: center;
	width: 100vw;
	height: 100vh;
	color: #fff;
	background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
	background-size: 400% 400%;
	animation: gradientBG 15s ease infinite;

	.title {
		margin-top: 220px;
		font-size: 50px;
	}

	.time {
		position: absolute;
		bottom: 160px;
		font-size: $timeFontSize;
		width: 100%;
		text-align: center;
		transition: all 1s;
		animation: timer 1s step-end infinite;
	}
}

.typewriter {
	width: 934px;
	margin: 140px auto 0 auto;
	h1 {
		overflow: hidden;
		border-right: 0.15em solid orange;
		white-space: nowrap;
		margin: 0 auto;
		letter-spacing: 0.15em;
		animation: typing 3.5s steps(40, end), blink-caret 1s step-end infinite;
	}
}
</style>
