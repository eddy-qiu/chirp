import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import { RouterOutputs, api } from "~/utils/api";

const CreatePostWizard = () => {
  
  const { user } = useUser();
  console.log(user);
  if (!user) return null;

  return <div className="flex gap-4 w-full">
    <img src= {user.profileImageUrl} 
    alt="Profile Image" 
    className="w-14 h-14 rounded-full"/>
    <input placeholder="Type some emojis!" className="bg-transparent grow outline-none">
    </input>
  </div>

};

// type PostWithUser = RouterOutputs["posts"]["getAll"][number];

// const PostView = (props: PostWithUser) => {
//   const { post, author } = props;
//   return (
//     <div key={post.id} className="p-8 border-b border-white">

//       {post.content}
//     </div>
//   )
// }

export default function Home() {
  const user = useUser();
  const {data, isLoading} = api.posts.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>Something went wrong</div>;

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
          <div className="flex flex-col">
            {[...data, ...data]?.map((fullPost) => (
              <PostView {...fullPost} key={fullPost.post.id} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
