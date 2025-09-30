import { api } from './api';

const possibleUrlKeys = [
	'checkoutUrl',
	'checkout_url',
	'paymentUrl',
	'payUrl',
	'shortLink',
] as const;

export async function createPayment(
	amount: number,
	description?: string,
): Promise<string | null> {
	const resp = await api.post('http://localhost:3000/api/payment/create-payment', {
		amount,
		description,
	});

	const data = resp.data || {};

	for (const key of possibleUrlKeys) {
		const url = data[key];
		if (typeof url === 'string' && url.startsWith('http')) return url;
	}

	// Some SDKs nest result under data or paymentLink
	const deepCandidates = [
		data.data,
		data.paymentLink,
		data.result,
		data.payload,
	];
	for (const node of deepCandidates) {
		if (!node) continue;
		for (const key of possibleUrlKeys) {
			const url = node[key];
			if (typeof url === 'string' && url.startsWith('http')) return url;
		}
	}

	return null;
}
