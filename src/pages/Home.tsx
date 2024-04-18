import { Card } from '../components/Card';
import DemoImage from '../assets/img/demo-image.jpeg';
import { Heading } from '../components/Heading.tsx';
import { Input } from '../components/Input.tsx';
import { Button } from '../components/Button.tsx';
import { SignedIn, SignedOut, LoginButton, LogoutButton, useAuth } from '@kobbleio/react';
import { useSupabaseContext } from '../context/SupabaseContext.tsx';
import { useEffect, useState } from 'react';
import { ImageCard } from '../components/ImageCard.tsx';
import { LoadingFrame } from '../components/LoadingFrame.tsx';
import { User } from '@kobbleio/react';
import { GithubLink } from '../components/GithubLink.tsx';

type ImageResult = { id: number; url: string };

const Home = () => {
	const { client: supabase } = useSupabaseContext();
	const [images, setImages] = useState<ImageResult[]>([]);
	const [isCreating, setIsCreating] = useState(false);
	const [isFetching, setIsFetching] = useState(false);
	const [prompt, setPrompt] = useState<string>('A cat in the forest');
	const { user } = useAuth();

	const generateImage = async () => {
		if (!supabase) return;

		setIsCreating(true);
		scrollTop();

		const res = await supabase.functions.invoke('generate-image', {
			body: {
				prompt
			}
		});

		const image = res.data[0] as ImageResult;
		setImages([image, ...images]);
		setIsCreating(false);
		scrollTop();
	};

	const scrollTop = () => {
		window.scrollTo(0, 0);
	};

	const fetch = async (user: User) => {
		setIsFetching(true);
		try {
			const res = await supabase?.from('Images').select('*').eq('user_id', user.id).order('created_at', { ascending: false });

			if (!res?.data) return;

			setImages(res.data as ImageResult[]);
		} catch (e) {
			console.error(e);
		} finally {
			setIsFetching(false);
		}
	};

	useEffect(() => {
		if (!supabase || !user) {
			return;
		}

		fetch(user);
	}, [supabase, user]);

	const refresh = async () => {
		if (!user) return;

		await fetch(user);
	};

	return (
		<div className="flex flex-col justify-between items-center w-full pb-20">
			<SignedIn>
				<header className={'fixed top-0 right-0 left-0 h-[50px] p-10 flex items-center justify-end gap-2'}>
					<LogoutButton>
						<Button>Logout</Button>
					</LogoutButton>
					<GithubLink />
				</header>
				<main className="py-20">
					<Heading />

					{isFetching && <LoadingFrame text={'Fetching images...'} />}

					{isCreating && <LoadingFrame text={'Generating image...'} />}

					{images?.map((image) => <ImageCard key={image.id} url={image.url} />)}
				</main>
				<div className={'fixed bottom-0 right-0 left-0 h-40 flex items-center justify-center'}>
					<Card className="overflow-x-scroll w-[500px]">
						<div className={'flex gap-2 items-center'}>
							<Input
								placeholder={'Type your prompt...'}
								onInput={(event) => {
									const target = event.target as HTMLInputElement;
									setPrompt(target.value);
								}}
							/>
							<SignedOut>
								<LoginButton>
									<Button>Sign in to generate</Button>
								</LoginButton>
							</SignedOut>
							<SignedIn>
								<Button onClick={generateImage}>Generate image</Button>
								<Button onClick={refresh}>Refresh</Button>
							</SignedIn>
						</div>
					</Card>
				</div>
			</SignedIn>

			<SignedOut>
				<header className={'fixed top-0 right-0 left-0 h-[50px] p-10 flex items-center justify-end gap-2'}>
					<GithubLink />
				</header>
				<main className="py-20">
					<Heading />
					<div className={'flex flex-col items-center justify-center gap-10'}>
						<ImageCard url={DemoImage}></ImageCard>
						<LoginButton>
							<Button>Sign in to generate images</Button>
						</LoginButton>
					</div>
				</main>
			</SignedOut>
		</div>
	);
};

export default Home;
