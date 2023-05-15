import {$, component$, Signal} from '@builder.io/qwik';
import {BoardProps} from '~/components/boards/form/BoardForm';
import {deleteBoard} from '~/store/automerge-doc';

export interface CardProps {
  board: BoardProps;
  open: Signal<boolean>;
}

export default component$<CardProps>((props) => {
  const handleOpen = $(() => {
    if (!props.open?.value) {
      props.open.value = true;
    }
  });
  const submit = $(async () => {
    await deleteBoard(props.board.id)
  });
  return (
    <div class={'w-[400px] mx-auto mt-2 p-10 rounded-lg shadow relative'}
         style={`background-color:${props.board?.color || 'white'}`}>
      <button
        class={'absolute top-3 right-5 w-3 text-gray-800 cursor-pointer hover:text-white hover:bg-gray-800 h-5 shadow-lg active:shadow-sm flex justify-center items-center rounded-full p-5'}
        onclick$={handleOpen}
      >
        <i class="bx bx-pencil"></i>
      </button>
      <button
        class={'absolute top-[65px] right-5 w-3 text-gray-800 cursor-pointer hover:text-white hover:bg-gray-800 h-5 shadow-lg active:shadow-sm flex justify-center items-center rounded-full p-5'}
        onclick$={submit}
      >
        <i class="bx bx-trash"></i>
      </button>
      <div class={'w-[300px]'}>
        <h1>{props.board?.title}</h1>
        <div
          class={'h-[200px] overflow-hidden text-[50%] break-words'}
          dangerouslySetInnerHTML={props.board?.description}
        />
      </div>
    </div>
  
  );
});
