import { defineAction } from '../action'

export const deleteMessageAction = defineAction({
  name: 'delete',
  description: 'Delete the message',
  execute: async ({ message }) => {
    message.deletable && (await message.delete())
  },
})
