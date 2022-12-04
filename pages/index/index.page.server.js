import http from 'http'
import https from 'https'
import fetch from 'node-fetch'

/**
 * fetch:  RESTful GET request returning result
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */

export { onBeforeRender, getAOCData };

async function onBeforeRender(pageContext) {
	const data = await getAOCData();
	return {
		pageContext: data
	}
}

function getAOCData() {

	const url = "https://adventofcode.com/2022/leaderboard/private/view/1704484.json";
	const options = {
		method: "GET",
		headers: {
			"User-Agent": "zimon@moudi.se https://github.com/YayL/AOC-Leaderboard",
			"Cookie": "session="
		}
	}
	
	return new Promise(resolve => {
		fetch(url, options)
		.then(async (res) => {
			resolve(await res.json());
		});
	});
}
