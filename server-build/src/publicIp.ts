import Axios from 'axios';

export const getMyPublicIp = async (): Promise<string> => {
	try {
		const res = await Axios.request({ url: 'http://ipv4bot.whatismyipaddress.com' });
		return res.data;
	} catch (error) {
		console.error('error when getMyPublicIp');
		return '';
	}
};
