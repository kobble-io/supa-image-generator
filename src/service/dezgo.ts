import axios from 'axios';

export const generateImage = async (prompt: string): Promise<{ data: Buffer }> => {
	const response = await axios.post(
		'https://api.dezgo.com/text2image',
		{
			prompt,
			width: 320,
			height: 320,
			model: '0001softrealistic_v187'
		},
		{
			responseType: 'arraybuffer',
			headers: {
				'x-dezgo-key': import.meta.env.VITE_DEZGO_API_KEY
			}
		}
	);

	return {
		data: response.data
	};
};
