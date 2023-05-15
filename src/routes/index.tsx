import {$, component$, useSignal,  useTask$} from '@builder.io/qwik';
import type {DocumentHead} from '@builder.io/qwik-city';
import BoardForm, {BoardProps} from '~/components/boards/form/BoardForm';
import Card from '~/components/boards/card';
import {findBoards} from '~/store/automerge-doc';
import {isServer} from '@builder.io/qwik/build';


export default component$(() => {
 const boards = useSignal<BoardProps[]>([])
  const editBoard = useSignal(false)
  
  useTask$(async ({track,cleanup})=>{
    track(()=>boards.value)
    if(!isServer) {
      boards.value = await findBoards() as BoardProps[];
    }
    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));
  })
  
 
  return (
    <div class="flex flex-col  min-h-screen bg-gray-100">
      <div class={'flex justify-end w-full bg-white p-10'}>
        <BoardForm open={editBoard} />
      </div>
      {<div>
        <pre>
          {JSON.stringify(boards.value)}
        </pre>
      </div>}
      <Card board={
        {
          id:'yeee',
          title: 'Hi 👋',
          description:' <h1>Welcome!</h1>\n' +
            '            <p>\n' +
            '              Can\'t wait to see what you build with qwik!\n' +
            '              <br/>\n' +
            '              Happy coding.\n' +
            '            </p>'
        }
      } open={editBoard}/>
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
  styles: [
  
  ]
};
