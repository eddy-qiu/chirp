import { SignInButton, useUser } from "@clerk/nextjs";
import Head from "next/head";

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import Image from 'next/image';
import { LoadingPage, LoadingSpinner } from "~/components/loading";

const CreatePostWizard = () => {
  
  const { user } = useUser();

  if (!user) return null;

  return <div className="flex gap-4 w-full">
    <Image 
      src= {user.profileImageUrl} 
      alt="Profile Image" 
      className="w-14 h-14 rounded-full"
      width={56}
      height={56}
    />
    <input placeholder="Type some emojis!" className="bg-transparent grow outline-none">
    </input>
  </div>

};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="flex flex-row border-b border-white p-4 gap-3">
      <Image 
        src={author.profilePicture} 
        alt={`@${author.username}'s profile picture`}
        className="w-14 h-14 rounded-full" 
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex gap-1">
          <span>{`@${author.username} `}</span>
          <span className="font-thin">{` • ${dayjs(post.createdAt).fromNow()}`}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  )
}

const Feed = () => {
  const {data, isLoading: postsLoading} = api.posts.getAll.useQuery();

  if (!postsLoading) return <LoadingPage />;

  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {[...data, ...data]?.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  )
}

export default function Home() {
  const {user, isLoaded: userLoaded} = useUser();
  const {data, isLoading: postsLoading} = api.posts.getAll.useQuery();

  // return empty div if both aren't loaded because user tends to load faster
  if (!userLoaded && !postsLoading) return <div />;

  return (
    <>
      <Head>
        <title>chirp</title>
        <meta name="description" content="chirp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-screen">
        <div className="bg-black border-x border-white w-full md:max-w-2xl">
          <div className="border-b p-4 border-white">
              {!user.isSignedIn && (
                <div className="flex justify-center">
                  <SignInButton />
                </div>
              )}
              {!!user.isSignedIn && <CreatePostWizard />}
          </div>
          
        </div>
      </main>
    </>
  );
}
