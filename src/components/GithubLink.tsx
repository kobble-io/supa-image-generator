import React, { LinkHTMLAttributes } from 'react';
import GithubLogo from '../assets/img/github-mark-white.svg';

export const GithubLink = () => {
	return (
		<a
			href="https://github.com/kobble-io/supa-image-generator"
			className="rounded-full border border-[#fff] bg-[#112220] text-[#fff] py-1 px-3 flex items-center justify-center gap-2">
			<img src={GithubLogo} width={20} height={20} />
			Fork on GitHub
		</a>
	);
};
