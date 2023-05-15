import {$, component$, QRL, useSignal, useStore, useTask$,} from '@builder.io/qwik';


import {v4 as uuidv4} from 'uuid';
import {isServer} from '@builder.io/qwik/build';
import {CardProps} from '~/components/boards/card';
import {addBoard} from '~/store/automerge-doc';

export interface BoardProps {
  id: string;
  color?: string;
  title?: string;
  description?: string;
}

export interface BoardFormProps extends CardProps{
}

export default component$<BoardFormProps>((props) => {
  const dialogRef = useSignal<HTMLDialogElement>();
  
  const id: string = uuidv4();
  const board: BoardProps = useStore<BoardProps>({
    id,
  });
  
  useTask$(async ({track,cleanup}) => {
    track(() => props.open?.value);
    if (!isServer) {
      if (props.open?.value===true) {
        dialogRef.value?.showModal();
      }
    }
      const abortController = new AbortController();
      cleanup(() => abortController.abort('cleanup'));
  });
  
  const handleOpenDialog = $(() => {
    dialogRef.value?.showModal();
  });
  
  const handleCloseDialog = $(function () {
    dialogRef.value?.close();
    if(props.open?.value){
      props.open.value = false;
    }
  });
  
  const submit = $(async () => {
   const bs = await addBoard(board)
    console.log(bs);
    await handleCloseDialog();
  });
  
  return (
    
    <>
      <button
        class={'h-10 px-6 font-semibold rounded-md bg-black text-white'}
        onclick$={handleOpenDialog}
      >
        Add Board
      </button>
      <dialog ref={dialogRef}
              class="px-10 m-auto max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 ">
        
        <div class="space-y-6">
          <h5
            class="text-xl font-medium text-gray-900 dark:text-white">{Object.keys(props.board || {}).length ? 'Update' : 'New'} Board</h5>
          <div class="flex flex-col items-center pb-3 ">
            <input
              type="color"
              value={board.color}
              oninput$={(e: { target: HTMLInputElement }) => {
                console.log(e.target.value);
                return (board.color = e.target.value);
              }}
              class={'p-[0.5px] b-0 cursor-pointer w-24 h-24 mb-3 rounded-full shadow-lg'}
            />
          </div>
          <div>
            <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
            <input
              type="text" name="title" id="title"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              required
              value={board.title}
              onChange$={(e) => board.title = e.target.value}
            />
          </div>
          <div>
            
            <label for="description"
                   class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
            <textarea
              name="description" id="description"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              required
              value={board.description}
              onChange$={(e) => board.description = e.target.value}
            />
          </div>
          
          <div class={'flex justify-between gap-2'}>
            <button
              class={'h-10 px-6 font-semibold rounded-md bg-white text-black'}
              onclick$={handleCloseDialog}>
              close
            </button>
            <button
              type="button"
              class={'h-10 px-6 font-semibold rounded-md bg-black text-white'}
              onclick$={submit}
            >
              Add
            </button>
          </div>
        
        </div>
      
      </dialog>
    </>
  
  );
});
