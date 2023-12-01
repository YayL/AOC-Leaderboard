import fetch from 'node-fetch'
import { usePageContext } from '../../renderer/usePageContext.ts'
import { getGlobal, setGlobal } from '../../server/store.ts'

/**
 * fetch:  RESTful GET request returning result
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */

export { passToClient, onBeforeRender, fetchData};

const passToClient = ['leaderboards'];
const max_name_length = 20;
const min_cache_time_or_something_in_minutes = 5;

const get_start_time = (day, year) => {return new Date(`${String(year).padStart(4, '20')}-12-${String(day).padStart(2, '0')}T06:00:00+01:00`);}

const truncate_name = (name) => name.length > max_name_length ? name.substring(0, max_name_length).padEnd(max_name_length + 3, '.') : name;

const set_ranks = (list) => {
	list.forEach((user, i) => user['#'] = i + 1);
	return list;
}

async function onBeforeRender(pageContext) {
	
	await fetchLeaderboards("2023");

	return {
		pageContext: {
			leaderboards: getGlobal('leaderboards')
		}
	}
}

async function fetchLeaderboards(year) {

	const data = await fetchData(year);
	const members = Object.values(data.members)

	const leaderboards = {
		score: calcScores(members),
		avgtimediff: calcAvgTimeDiffScore(members, year)
	}
	
	setGlobal('leaderboards', leaderboards);

}

const calcScores = (data) => set_ranks(data.map((user) => ({
		'#': 0,
		Name: user.name ? truncate_name(user.name) : "Anonymous User",
		Points: user.local_score,
})).filter((user) => user.Points != 0).sort((a, b) => b.Points - a.Points));

const calcAvgTimeDiffScore = (members) => {
	let scores = members.map((user, index) => ({
		'#': 0,
		Name: user.name ? truncate_name(user.name) : "Anonymous User",
		Score: 0,
		Completions: 0,
	}));
	const DOM = new Date().getDate(); // Day of Month
    
	for (let i = 1; i <= DOM; ++i) {
		scores.forEach((user, index) => {
			const completions = members[index].completion_day_level;
			let value = (completions[String(i)]?.['2']?.get_star_ts - 
						 completions[String(i)]?.['1']?.get_star_ts);
			if (!Number.isNaN(value)) {
				user.Score += value;
				user.Completions++;
			}
		})
	}
	
	scores = scores.filter((user) => user.Completions != 0);

	scores.forEach((user) => {user.Score = Math.floor(user.Score / user.Completions)});

	return set_ranks(scores.sort((a, b) => {
		return (a.Completions == b.Completions) 
					? a.Score - b.Score
					: (b.Completions - a.Completions)
	}));
};

function fetchData(year) {
	const fetch_time = new Date();
	const last_cache = getGlobal("last_cache");

	if (last_cache != undefined) {
		if (fetch_time < (last_cache / 1 + (min_cache_time_or_something_in_minutes * 60 * 1000))) {
			console.log("[FetchData]: Trying cached data");
			const data = getGlobal('data_cache');
			if (data != undefined)
				return data
		}
	}

	setGlobal('last_cache', fetch_time);

	const url = `https://adventofcode.com/${String(year).padStart(4, '20')}/leaderboard/private/view/1704484.json`;

	const options = {
		method: "GET",
		headers: {
			"User-Agent": `${process.env.EMAIL} ${process.env.GITHUB_REPO_URL}`,
			"Cookie": `session=${process.env.SESSION_TOKEN}`
		}
	}
	
	return new Promise(resolve => {
		fetch(url, options)
		.then(async (res) => {
			const data_cache = await res.json();
			setGlobal('data_cache', data_cache);
			resolve(data_cache);
		});
	});
}
