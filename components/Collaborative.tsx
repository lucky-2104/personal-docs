"use client";
import { ClientSideSuspense, RoomProvider } from '@liveblocks/react/suspense'
import React from 'react'
import Header from './Header';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Editor } from './editor/Editor';
import ActiveCollaborator from './ActiveCollaborator';

const Collaborative = ({roomId , roomMetadata} :CollaborativeRoomProps) => {
  console.log(roomId)
  return (
      <RoomProvider id={roomId}>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
            <div className='collaborative-room'>
              <Header>
                <div className='flex w-fit items-center justify-center gap-2'>
                    <p className='document-title'>Share</p>
            </div>
            <div className='flex w-full flex-1 justify-end gap-2 sm:gap-3'>
                <ActiveCollaborator/>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
                </Header>
                <Editor/>
            </div>
        </ClientSideSuspense>
      </RoomProvider>
  )
}

export default Collaborative