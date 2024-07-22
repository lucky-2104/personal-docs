import React from 'react'
import {Editor} from '@/components/editor/Editor'
import Header from '@/components/Header';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Collaborative from '@/components/Collaborative';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getDocument } from '@/lib/actions/room.actions';
const Documents = async ({ params: { id } } : SearchParamProps) => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect('/sign-in');
  
  const room = await getDocument({
    roomId: id,
    userId: clerkUser.emailAddresses[0].emailAddress,
  });

  console.log(room);
  if (!room) redirect('/');
  
  //TODO :: assess permissions
  return (
    <main className='flex w-full flex-col items-center'>
      <Collaborative
        roomId={id}
        roomMetadata={room.metadata}      />
    </main>
        
  )
}

export default Documents;