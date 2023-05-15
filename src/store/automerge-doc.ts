import * as Automerge from '@automerge/automerge';
import {BoardProps} from '~/components/boards/form/BoardForm';
import * as localforage from 'localforage';

// import {DocHandlePatchPayload, Repo} from 'automerge-repo';
// import { BroadcastChannelNetworkAdapter } from "automerge-repo-network-broadcastchannel"
// import { LocalForageStorageAdapter } from "automerge-repo-storage-localforage"
// import {$, QRL, Signal, useSignal, useTask$} from '@builder.io/qwik';
// import {ChangeFn, Doc} from '@automerge/automerge';
// import {BoardProps} from '~/components/boards/form/BoardForm';
// import {isServer} from '@builder.io/qwik/build';

export interface BoardSchema {
  boards: BoardProps[];
}

// const repo = new Repo({
//   network: [new BroadcastChannelNetworkAdapter()],
//   storage: new LocalForageStorageAdapter(),
// })
//
// export function useDocument<T>() {
//   const doc:Signal<Doc<T> | undefined> = useSignal<Doc<T>>()
//
//
//   useTask$(({track}) => {
//
//      if(isServer) {
//        return
//      }
//      track(() => handle)
//     let documentId = localStorage.rootDocId
//     if (!documentId) {
//       const handle = repo.create()
//       localStorage.rootDocId = documentId = handle.documentId
//     }
//
//     const handle = documentId ? repo.find<T>(documentId) : null
//     if (!handle) return
//
//     handle.value().then((v: Doc<T>) => doc.value = v as Doc<T>)
//
//     const onPatch = (h: DocHandlePatchPayload<T>) => (doc.value = h.after)
//     handle.on("patch", onPatch)
//     const cleanup = () => {
//       handle.removeListener("patch", onPatch)
//     }
//
//     return cleanup
//   })
//
//   const changeDoc = $(async (changeFn: ChangeFn<T>) => {
//     const documentId = localStorage.rootDocId
//     const handle = documentId ? repo.find<T>(documentId) : null
//     if (!handle) return
//     return handle.change(changeFn)
//   })
//
//   return [doc,changeDoc]  as [Signal<Doc<T> | undefined>, QRL<(changeFn: ChangeFn<T>) => void>]
// }

// type Schema = {
//   count: Automerge.Counter,
//   text: Automerge.Text,
//   boards: BoardProps[]
// }


export const addBoard = async (board: BoardProps) => {
  let binary = await localforage.getItem('autoMerge-store') as unknown as Uint8Array;
  let doc = undefined as unknown as BoardSchema;
  if (binary) {
    doc = Automerge.load(binary);
  }
  if (!doc) {
    doc = Automerge.init();
  }
  const newDoc = Automerge.change(doc, (d) => {
    if (!d.boards) {
      d.boards = [] as unknown as Automerge.List<BoardProps>;
    }
    d.boards.push(board);
  });
  doc = newDoc;
  binary = Automerge.save(doc);
  await localforage.clear();
  await localforage.setItem('autoMerge-store', binary);
  const schema: BoardSchema = Automerge.load(binary);
  return schema.boards;
};


export const findBoards = async () => {
  try {
    const binary = await localforage.getItem('autoMerge-store') as unknown as Uint8Array;
    if (binary) {
      const doc: BoardSchema = Automerge.load(binary);
      return doc.boards;
    }
    return [];
  } catch (err) {
    // This code runs if there were any errors.
    console.log(err);
  }
};

export const updateBoard = async (boardId: string, newBoard: BoardProps) => {
  try {
    let binary = await localforage.getItem('autoMerge-store') as unknown as Uint8Array;
    const doc = undefined as unknown as BoardSchema;
    const boards = doc.boards.map(b => {
      if (b.id === boardId) {
        return newBoard;
      }
      return b;
    });
    
    const newDoc = Automerge.change(Automerge.clone(doc), (d) => {
      if (!d.boards) {
        d.boards = [] as unknown as Automerge.List<BoardProps>;
      }
      d.boards = boards as unknown as Automerge.List<BoardProps>;
    });
    binary = Automerge.save(newDoc);
    await localforage.clear();
    await localforage.setItem('autoMerge-store', binary);
    const schema: BoardSchema = Automerge.load(binary);
    return schema.boards as BoardProps[];
  } catch (err) {
    // This code runs if there were any errors.
    console.log(err);
  }
  return [] as BoardProps[];
};
export const deleteBoard = async (boardId: string) => {
  try {
    const binary = await localforage.getItem('autoMerge-store') as unknown as Uint8Array;
    const doc: BoardSchema = Automerge.load(binary);
    const itemIndex = doc.boards.findIndex((item) => item.id === boardId);
    
    if (itemIndex !== -1) {
      const newDoc = Automerge.change(doc, (d) => {
        d.boards.splice(itemIndex, 1);
      });
      
      const binary = Automerge.save(newDoc);
      await localforage.clear();
      await localforage.setItem('autoMerge-store', binary);
      const schema: BoardSchema = Automerge.load(binary);
      return schema.boards;
    }
  } catch (err) {
    // This code runs if there were any errors.
    console.log(err);
  }
};
