'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { getPublicUrl } from '@/lib/storage'
import { useRouter } from 'next/navigation'

export default function AddPetModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', species: 'dog', breed: '', notes: '' })
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null))
  }, [])

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      let photo_url: string | null = null
      if (file && userId) {
        const path = `${userId}/pets/${crypto.randomUUID()}-${file.name}`
        const { error: upErr } = await supabase.storage.from('pet-media').upload(path, file, { upsert: true })
        if (upErr) throw upErr
        photo_url = getPublicUrl(path)
      }
      const { error: insErr } = await supabase.from('pets').insert([
        {
          owner_id: userId,
          name: form.name,
          species: form.species,
          breed: form.breed || null,
          notes: form.notes || null,
          photo_url,
        },
      ])
      if (insErr) throw insErr
      setOpen(false)
      setForm({ name: '', species: 'dog', breed: '', notes: '' })
      setFile(null)
      router.refresh()
    } catch (err: any) {
      setError(err?.message || 'Failed to add pet.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <button className="btn-primary" onClick={() => setOpen(true)} disabled={!userId}>
        Add Pet
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add Pet</h2>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input name="name" value={form.name} onChange={onChange} className="mt-1 w-full rounded border p-2" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Species</label>
                  <select name="species" value={form.species} onChange={onChange} className="mt-1 w-full rounded border p-2">
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Breed</label>
                  <input name="breed" value={form.breed} onChange={onChange} className="mt-1 w-full rounded border p-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Notes</label>
                <textarea name="notes" value={form.notes} onChange={onChange} className="mt-1 w-full rounded border p-2" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium">Photo</label>
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mt-1 w-full" />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

