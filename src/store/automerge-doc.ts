import * as Automerge from '@automerge/automerge';
import {BoardProps} from '~/components/boards/form/BoardForm';
import * as localforage from 'localforage';


type Schema = {
  count: Automerge.Counter,
  text: Automerge.Text,
  boards: BoardProps[]
}

export const addBoard = async (board: BoardProps) => {
  let binary = await localforage.getItem('autoMerge-store') as unknown as Uint8Array;
  let doc: Schema = Automerge.load(binary);
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
  return Automerge.load(binary);
};
export const findBoards = async () => {
  try {
    const binary = await localforage.getItem('autoMerge-store') as unknown as Uint8Array;
    // This code runs once the value has been loaded
    // from the offline store.
    const store: Schema = Automerge.load(binary);
    return store.boards;
  } catch (err) {
    // This code runs if there were any errors.
    console.log(err);
  }
};

export const updateBoard = async (boardId: string, newBoard: BoardProps) => {
  try {
    let boards = await findBoards() as unknown as BoardProps[];
    boards = boards.map(b => {
      if (b.id === boardId) {
        return newBoard;
      }
      return b;
    });
    let binary = await localforage.getItem('autoMerge-store') as unknown as Uint8Array;
    const doc: Schema = Automerge.load(binary);
    const newDoc = Automerge.change(Automerge.clone(doc), (d) => {
      if (!d.boards) {
        d.boards = [] as unknown as Automerge.List<BoardProps>;
      }
      d.boards = boards as unknown as Automerge.List<BoardProps>;
    });
    binary = Automerge.save(newDoc);
    await localforage.clear();
    await localforage.setItem('autoMerge-store', binary);
  } catch (err) {
    // This code runs if there were any errors.
    console.log(err);
  }
};
