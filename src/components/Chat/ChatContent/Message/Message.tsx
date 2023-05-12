import React from 'react';
import { useTranslation } from 'react-i18next';

import useDropDown from '@hooks/useDropDown';

import useStore from '@store/store';

import { ChatInterface, Role, roles } from '@type/chat';

import Avatar from './Avatar';
import MessageContent from './MessageContent';

import LeftButton from './Button/LeftButton';
import RightButton from './Button/RightButton';

// const backgroundStyle: { [role in Role]: string } = {
//   user: 'dark:bg-gray-800',
//   assistant: 'bg-gray-50 dark:bg-gray-650',
//   system: 'bg-gray-50 dark:bg-gray-650',
// };
const backgroundStyle = ['dark:bg-gray-800', 'bg-gray-50 dark:bg-gray-650'];

const Message = React.memo(
  ({
    role,
    content,
    messageIndex,
    versions,
    versionIndex,
    sticky = false,
  }: {
    role: Role;
    content: string;
    messageIndex: number;
    versions?: string[] | undefined;
    versionIndex?: number | undefined;
    sticky?: boolean;
  }) => {
    const { t } = useTranslation();
    const DropDown = useDropDown;

    const generating = useStore.getState().generating;

    const setChats = useStore((state) => state.setChats);
    const setInputRole = useStore((state) => state.setInputRole);

    const hideSideMenu = useStore((state) => state.hideSideMenu);
    const advancedMode = useStore((state) => state.advancedMode);
    const currentChatIndex = useStore((state) => state.currentChatIndex);

    const handleVersion = (index: number, version: string) => {
      const updatedChats: ChatInterface[] = JSON.parse(
        JSON.stringify(useStore.getState().chats)
      );
      const updatedMessages = updatedChats[currentChatIndex].messages;

      updatedMessages[messageIndex].content = version;
      updatedMessages[messageIndex].versionIndex = index;

      setChats(updatedChats);
    };

    return (
      <div
        className={`w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group ${
          backgroundStyle[messageIndex % 2]
        }`}
      >
        <div
          className={`text-base gap-4 md:gap-6 m-auto p-4 md:py-6 flex transition-all ease-in-out ${
            hideSideMenu
              ? 'md:max-w-5xl lg:max-w-5xl xl:max-w-6xl'
              : 'md:max-w-3xl lg:max-w-3xl xl:max-w-4xl'
          }`}
        >
          <Avatar role={role} />
          <div className='w-[calc(100%-50px)] '>
            <div className='relative flex flex-row justify-between items-center; gap-1 md:gap-3 lg:w-[calc(100%-115px)]'>
              {advancedMode && (
                <DropDown
                  selected={t(role)}
                  selections={roles.map((r) => t(r))}
                  onClick={() => {
                    if (!sticky) {
                      const updatedChats: ChatInterface[] = JSON.parse(
                        JSON.stringify(useStore.getState().chats)
                      );
                      updatedChats[currentChatIndex].messages[
                        messageIndex
                      ].role = role;
                      setChats(updatedChats);
                    } else {
                      setInputRole(role);
                    }
                  }}
                />
              )}

              {!sticky && versions?.length && versions.length > 0 && (
                <div className='flex items-center justify-center'>
                  <LeftButton
                    onClick={() => {
                      const previousVersion =
                        (versionIndex !== undefined
                          ? versionIndex
                          : versions.length - 1) - 1;

                      if (!generating && previousVersion >= 0) {
                        handleVersion(
                          previousVersion,
                          versions[previousVersion]
                        );
                      }
                    }}
                  />

                  <span className='text-xs pl-2 pr-2'>{`${
                    (versionIndex || 0) + 1
                  } / ${versions.length}`}</span>

                  <RightButton
                    onClick={() => {
                      const nextVersion =
                        (versionIndex !== undefined
                          ? versionIndex
                          : versions.length - 1) + 1;

                      if (!generating && nextVersion <= versions.length - 1) {
                        handleVersion(nextVersion, versions[nextVersion]);
                      }
                    }}
                  />
                </div>
              )}
            </div>
            <MessageContent
              role={role}
              content={content}
              messageIndex={messageIndex}
              sticky={sticky}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default Message;
