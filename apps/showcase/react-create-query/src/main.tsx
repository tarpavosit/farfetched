import { createQuery } from '@farfetched/core';
import { useQuery } from '@farfetched/react';
import { StrictMode, useState } from 'react';
import * as ReactDOM from 'react-dom/client';
import { createEffect } from 'effector';

const pokemonsQuery = createQuery({
  effect: createEffect<{ limit: number }, any, TypeError>(({ limit }) =>
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`).then((response) =>
      response.json()
    )
  ),
  mapData: (data: any) => data.results as Array<{ name: string }>,
});

export function App() {
  const { data: pokemons, pending, start } = useQuery(pokemonsQuery);

  const [limit, setLimit] = useState(10);

  return (
    <>
      <h1>Pokemon 💙 Farfetched</h1>
      <label>
        Limit:
        <input
          min={1}
          value={limit}
          type="number"
          onChange={(e) => setLimit(e.target.valueAsNumber)}
        />
      </label>
      <button onClick={() => start({ limit })}>Load pokemons</button>
      {pending && <p>Loading...</p>}
      {pokemons && (
        <ol>
          {pokemons.map((pokemon) => (
            <li key={pokemon.name}>{pokemon.name}</li>
          ))}
        </ol>
      )}
    </>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
