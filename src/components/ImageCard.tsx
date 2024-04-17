import React from 'react';
import { Card } from './Card.tsx';

interface ImageCardProps {
	url: string;
}

export const ImageCard: React.FC<ImageCardProps> = ({ url }) => {
	return (
		<Card className="w-[400px]">
			<img src={url} alt="Demo image" className="w-full" />
		</Card>
	);
};
