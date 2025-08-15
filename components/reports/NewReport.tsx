'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { getPublicUrl } from '@/lib/storage'
import { useRouter } from 'next/navigation'

export default function NewReport({ petId }: { petId: string }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    happened_at: '',
    duration_minutes: 30 as number | string,
    distance_m: '' as number | string,
    potty1: false,
    potty2: false,
    notes: '',
  })
  const [file, setFile] = useState<File | null>(null)

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type, checked } = e.target as any
    setForm((p: any) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const { data: userData } = await supabase.auth.getUser()
      const uid = userData.user?.id
      let photo_url: string | null = null
      if (file && uid) {
        const path = `${uid}/reports/${crypto.randomUUID()}-${file.name}`
        const { error: upErr } = await supabase.storage.from('pet-media').upload(path, file, { upsert: true })
        if (upErr) throw upErr
        photo_url = getPublicUrl(path)
      }
      const { error: insErr } = await supabase.from('visit_reports').insert([
        {
          pet_id: petId,
          happened_at: form.happened_at || null,
          duration_minutes: Number(form.duration_minutes) || null,
          distance_m: Number(form.distance_m) || null,
          potty1: form.potty1,
          potty2: form.potty2,
          notes: form.notes || null,
          photo_url,
        },
      ])
      if (insErr) throw insErr
      router.refresh()
    } catch (err: any) {
      setError(err?.message || 'Failed to add report.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 bg-white p-4 rounded-md border">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium">When</label>
          <input type="datetime-local" name="happened_at" value={form.happened_at} onChange={onChange} className="mt-1 w-full rounded border p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Duration (min)</label>
          <input type="number" name="duration_minutes" value={form.duration_minutes} onChange={onChange} className="mt-1 w-full rounded border p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Distance (m)</label>
          <input type="number" name="distance_m" value={form.distance_m} onChange={onChange} className="mt-1 w-full rounded border p-2" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" name="potty1" checked={form.potty1} onChange={onChange} /> Potty #1</label>
        <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" name="potty2" checked={form.potty2} onChange={onChange} /> Potty #2</label>
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
      <div className="flex justify-end">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Report'}</button>
      </div>
    </form>
  )
}

