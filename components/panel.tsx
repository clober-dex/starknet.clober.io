import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

const Panel = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (open: boolean) => void
} & React.PropsWithChildren) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[10000]" onClose={setOpen}>
        <div className="fixed inset-0 bg-transparent bg-opacity-5 backdrop-blur-sm" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto max-w-md">
                  <div className="flex h-full flex-col bg-gray-950 shadow-xl">
                    <div className="flex items-center px-4 h-16 justify-end">
                      <div className="flex items-start">
                        <div className="flex items-center">
                          <button
                            type="button"
                            className="relative rounded-md text-gray-400 hover:text-gray-500 outline-none"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col text-white justify-center text-base font-bold relative mb-6 flex-1 pl-6 pr-16 gap-8">
                      <div className="flex flex-col gap-4 items-start w-[192px]">
                        <Link
                          className="link"
                          target="_blank"
                          href="https://docs.clober.io/"
                          rel="noreferrer"
                        >
                          Docs
                        </Link>
                        <Link
                          className="link"
                          target="_blank"
                          href="https://twitter.com/CloberDEX"
                          rel="noreferrer"
                        >
                          Twitter
                        </Link>
                        <Link
                          className="link"
                          target="_blank"
                          href="https://discord.gg/clober-dex"
                          rel="noreferrer"
                        >
                          Discord
                        </Link>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default Panel
