Patch app/pets/page.tsx

Replace any pattern like:

const { data: pets } = await supabase
  .from('pets')
  .select('*')
  .order('created_at', { ascending: false });


with a null-safe, typed version:

type Pet = {
  id: string;
  owner_id: string;
  name: string;
  species: string | null;
  breed: string | null;
  sex: string | null;
  weight_kg: number | null;
  dob: string | null;
  notes: string | null;
  photo_url: string | null;
  created_at: string;
};

const { data: petsData, error: petsError } = await supabase
  .from('pets')
  .select(
    'id,owner_id,name,species,breed,sex,weight_kg,dob,notes,photo_url,created_at'
  )
  .order('created_at', { ascending: false })
  .returns<Pet[]>();

const pets: Pet[] = petsData ?? []; // ← ALWAYS an array


Update the JSX guards to use the guaranteed array:

{pets.length === 0 ? (
  <div className="card max-w-xl mx-auto text-center">
    <p className="text-gray-700">No pets yet.</p>
  </div>
) : (
  <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {pets.map((p) => (
      <li key={p.id}>{/* render PetCard here */}</li>
    ))}
  </ul>
)}


If you previously used optional chaining in JSX, you can keep it, but the petsData ?? [] coalesce is required so pets.length type-checks.

(Consistency) Audit this file for any other nullable arrays

If there are other Supabase data results used directly in .length or .map, coalesce them the same way:

const rows = data ?? [];


Do NOT use typescript.ignoreBuildErrors

We want a real fix, not a bypass.

Acceptance

npm run build succeeds without the “possibly 'null'” error.

/pets renders correctly when there are 0 or more pets.

After patching, run:

npm run build


If the error moves to another variable, apply the same data ?? [] pattern there as well.