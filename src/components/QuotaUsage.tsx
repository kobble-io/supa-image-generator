import { useAccessControl } from '@kobbleio/react';

export const QuotaUsage = () => {
	const { quotas } = useAccessControl();

	const imageGeneratedQuota = quotas?.find((quota) => quota.name === 'image-generated');

	if (!imageGeneratedQuota) {
		return null;
	}

	return (
		<div className="rounded-full border border-[#236456] bg-[#112220] text-[#33C6AB] py-1 px-3 flex gap-2">
			<div>
				Usage: {imageGeneratedQuota.usage}/ {imageGeneratedQuota.limit}
			</div>
		</div>
	);
};
