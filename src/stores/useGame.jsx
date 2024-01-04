/**
 * Creating a Store with Zustand
 */

import { create } from 'zustand'

export default create(() =>
{
  return {
    blocksCount: 3,
  }
})
