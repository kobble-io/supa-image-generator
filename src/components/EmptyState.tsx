import { FC } from 'react';
import { Card } from './Card';

export type Props = {
	text: string;
};

export const EmptyState: FC<Props> = ({ text }) => {
	return <Card className="overflow-x-scroll w-[400px]">{text}</Card>;
};
