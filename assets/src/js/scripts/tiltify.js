/* local imports */ 
import secret from '../../../../secret.txt';

export const tiltify = {
	token : secret,
	campaign : 169251,
	fetchParams : {
		method: 'GET',
		headers: {
			'Authorization' : `Bearer ${secret}`,
			'Content-Type' : `application/json`
		}
	},
	addUser : (list, data) => {
		// add user data to responses
		list = list.map((l) => {
			l.user = data.user;
			l.user.campaign = `${data.user.url}/${data.slug}`;
			return l;
		});
	},
	request : {
		campaign : async () => {
			const response = await fetch(`https://tiltify.com/api/v3/campaigns/${tiltify.campaign}`, tiltify.fetchParams);
			const json = await response.json();	
	
			if (json && json.data) {
				// update user data of campaign
				json.data.url = json.data.team.url;
				json.data.user = {
					username : json.data.name,
					url : json.data.url
				};					
	
				return json.data;
			}			
		},
		donations : async (id, data) => {
			const response = await fetch(`https://tiltify.com/api/v3/campaigns/${id}/donations?count=50`, tiltify.fetchParams);		
			const json = await response.json();
	
			if (json && json.data) {
				// add user data to donation
				tiltify.addUser(json.data, data);

				return json.data;
			}			
		},
		rewards : async (id, data) => {
			const response = await fetch(`https://tiltify.com/api/v3/campaigns/${id}/rewards`, tiltify.fetchParams);		
			const json = await response.json();
	
			if (json && json.data) {
				// get time for checking if rewards have expired
				const currentTime = Date.now();

				// filter out remaining and null rewards
				json.data = json.data.filter((data) => {
					const rewardExpired = data.endsAt < currentTime;
					data.remaining = typeof data.remaining != 'number' ? 0 : data.remaining;					
					return !rewardExpired && data.remaining !== 0 && data.active && !data.alwaysActive;
				});

				// add user data to reward
				tiltify.addUser(json.data, data);

				return json.data;
			}
		},
		challenges : async (id, data) => {
			const response = await fetch(`https://tiltify.com/api/v3/campaigns/${id}/challenges`, tiltify.fetchParams);		
			const json = await response.json();
	
			if (json && json.data) {
				// get time for checking if challenges have expired
				const currentTime = Date.now();

				// filter out challenges that have been met
				json.data = json.data.filter((data) => {
					const challengeExpired = data.endsAt < currentTime;
					return !challengeExpired && (data.totalAmountRaised < data.amount);
				});

				// add user data to challenge
				tiltify.addUser(json.data, data);

				return json.data;
			}
		}
	}
};