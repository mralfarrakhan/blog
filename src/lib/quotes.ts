export type Quote = {
	text: string;
	author: string;
	source?: string;
};

export const quotes: Quote[] = [
	{
		text: 'And I will care even less. I want to live a thousand more years.',
		author: 'Chairil Anwar',
		source: 'Aku (1943)',
	},
	{
		text: 'Whence does time arise, and whither does it flee? Has it a beginning, and shall it ever find an end? God alone knows.',
		author: 'Marah Roesli',
		source: 'Sitti Nurbaya (1922)',
	},
	{
		text: 'Forget it, silence your dreams. Cast off those shackles. What good is clinging to the past?',
		author: 'Armijn Pane',
		source: 'Belenggu (1940)',
	},
	{
		text: 'Nature is sometimes mute, and sometimes it speaks; at times draped in gloom, at times aglow with joy.',
		author: 'Hamka',
		source: 'Tenggelamnya Kapal Van der Wijck (1938)',
	},
	{
		text: 'The best fate is to never have been born, second is to be born but die young, and the most unfortunate of all is old age.',
		author: 'Soe Hok Gie',
		source: 'Catatan Seorang Demonstran (1983)',
	},
	{
		text: 'I know, this day reaps the fire, reaps the threats and blunts the embers, written and inscribed upon my hands.',
		author: 'Amir Hamzah',
		source: 'Nyanyi Sunyi (1937)',
	},
	{
		text: 'In silence grows the stalk',
		author: 'Tan Malaka',
		source: 'Naar de Republiek Indonesia (1925)',
	},
	{
		text: 'For I did not intend to write well. I wished to write as so to be heard.',
		author: 'Multatuli',
		source: 'Max Havelaar (1860)',
	},
];

export function getRandomQuote(): Quote {
	const randomIndex = Math.floor(Math.random() * quotes.length);
	return quotes[randomIndex];
}
