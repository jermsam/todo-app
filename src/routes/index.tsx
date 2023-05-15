import {component$, Signal, useSignal, useTask$, useVisibleTask$} from '@builder.io/qwik';
import type {DocumentHead} from '@builder.io/qwik-city';
import BoardForm, {BoardProps} from '~/components/boards/form/BoardForm';
import Card from '~/components/boards/card';
import {findBoards} from '~/store/automerge-doc';
import {isBrowser} from '@builder.io/qwik/build';
// import {routeLoader$} from '@builder.io/qwik-city';
// import {isBrowser} from '@builder.io/qwik/build';

// export const useBoards = routeLoader$(async () => {
//   if(isBrowser) {
//     return (await findBoards()) as BoardProps[];
//   }
//   return []
// });


export default component$(() => {
  const boards:Signal<BoardProps[] | undefined> = useSignal<BoardProps[]>();
 
  const editBoard = useSignal(false);
  
  useVisibleTask$(async ()=>{
      boards.value = (await findBoards()) as BoardProps[]
  })
  
  useTask$(()=>{
   if (isBrowser){
     window.addEventListener("storage", async () => {
       // When local storage changes, dump the list to
       // the console.
       console.log('we changed');
       boards.value = (await findBoards()) as BoardProps[]
     });
    }
  })
  
  return (
    <div class="flex flex-col  min-h-screen bg-gray-100">
      <div class={'flex justify-end w-full bg-white p-10'}>
        <BoardForm open={editBoard}/>
      </div>
      {
        boards.value && (
          <div class="flex gap-1 flex-wrap">
            {
              boards.value.map(board => (
                <Card
                  key={board.id}
                  board={board}
                  open={editBoard}
                />
              ))
            }
          </div>
        )
      }
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
  links: [
    {
      rel: 'stylesheet',
      href: 'https://unpkg.com/boxicons@latest/css/boxicons.min.css',
    },
  ],
  styles: [],
};
