"use client";


import { ClientSideSuspense, RoomProvider, useStatus } from '@liveblocks/react/suspense'
import React , {useEffect, useRef, useState} from 'react'
import Header from './Header';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Editor } from './editor/Editor';
import ActiveCollaborator from './ActiveCollaborator';
import { Input } from './ui/input';
import Image from 'next/image';
import { updateDocument } from '@/lib/actions/room.actions';
const Collaborative = ({roomId , roomMetadata} :CollaborativeRoomProps) => {
    //   console.log(roomId)
    const currentUserType = 'editor';
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLDivElement>(null);
    const updateTitleHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => { 
        if (e.key === 'Enter') {
            setLoading(true);
    
            try {
                if (documentTitle !== roomMetadata.title) {
                    const updatedDocument = await updateDocument(roomId, documentTitle);
                    if(updatedDocument) setEditing(false);
                }
                
            } catch (error) {
                
            }
            setLoading(false);
        }
    }

    useEffect(() => { 
        const handleClickOutside = (e: MouseEvent) => { 
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setEditing(false);
            }
            updateDocument(roomId, documentTitle);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => { 
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [roomId,documentTitle])
    useEffect(() => { 
       if(editing && inputRef.current) { 
           inputRef.current.focus();
       }
    },[editing])
  return (
      <RoomProvider id={roomId}>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
            <div className='collaborative-room'>
              <Header>
                <div ref= {containerRef} className='flex w-fit items-center justify-center gap-2'>
                          {editing  && !loading ? (
                              <Input
                                  type='text'
                                  value={documentTitle}
                                  ref={inputRef}
                                  placeholder='Untitled Document'
                                  onChange={(e) => setDocumentTitle(e.target.value)}
                                  onKeyDown={updateTitleHandler}
                                  disable={!editing}
                                  className='document-title-input'
                              
                              />
                          ) : (
                                  <>
                                      <p className='document-title'>{ documentTitle}</p> 
                                  </>
                          )}
                          {currentUserType === 'editor' && !editing && (
                              <Image
                                  src='/assets/icons/edit.svg'
                                  alt='edit'
                                  width={24}
                                  height={24}
                                  onClick={() => setEditing(true)}
                                  className='pointer'
                              />
                          )} 
                          {currentUserType !== 'editor' && !editing && (
                              <p className='view-only-tag'>View Only</p>
                          )} 
                          {loading && <p className='text-sm text-gray-400'>saving...</p>}
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