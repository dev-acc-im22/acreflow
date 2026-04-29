'use client';

import { useState } from 'react';
import { StickyNote, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { useAcreFlowStore } from '@/lib/store';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface PropertyNotesProps {
  propertyId: string;
}

const MAX_CHARS = 500;

export default function PropertyNotes({ propertyId }: PropertyNotesProps) {
  const { getPropertyNote, addPropertyNote, removePropertyNote } = useAcreFlowStore();
  const existingNote = getPropertyNote(propertyId);

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [editText, setEditText] = useState('');

  const handleAdd = () => {
    const trimmed = noteText.trim();
    if (!trimmed) return;
    addPropertyNote({
      propertyId,
      note: trimmed,
      createdAt: new Date().toISOString(),
    });
    setNoteText('');
    setIsAdding(false);
  };

  const handleEdit = () => {
    if (!existingNote) return;
    setEditText(existingNote.note);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const trimmed = editText.trim();
    if (!trimmed) return;
    addPropertyNote({
      propertyId,
      note: trimmed,
      createdAt: existingNote.createdAt,
    });
    setIsEditing(false);
    setEditText('');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      removePropertyNote(propertyId);
      setIsEditing(false);
    }
  };

  const formatTimestamp = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Existing note display
  if (existingNote && !isAdding) {
    return (
      <div className="border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-900/10 rounded-r-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <StickyNote className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-navy dark:text-white">My Notes</h3>
          </div>
          <div className="flex items-center gap-1">
            {!isEditing && (
              <>
                <button
                  onClick={handleEdit}
                  className="w-8 h-8 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/20 transition flex items-center justify-center cursor-pointer"
                  aria-label="Edit note"
                >
                  <Pencil className="w-3.5 h-3.5 text-slate-accent dark:text-[#94A3B8]" />
                </button>
                <button
                  onClick={handleDelete}
                  className="w-8 h-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center justify-center cursor-pointer"
                  aria-label="Delete note"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Edit your note..."
              className="min-h-[100px] bg-white dark:bg-[#112240] border-amber-200 dark:border-[#1D3461] text-sm"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-accent dark:text-[#64748B]">
                {editText.length}/{MAX_CHARS}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditText('');
                  }}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1D3461] transition flex items-center justify-center cursor-pointer"
                  aria-label="Cancel edit"
                >
                  <X className="w-4 h-4 text-slate-accent dark:text-[#94A3B8]" />
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={!editText.trim()}
                  className="w-8 h-8 rounded-lg bg-royal hover:bg-royal-dark text-white transition flex items-center justify-center disabled:opacity-40 cursor-pointer"
                  aria-label="Save note"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-navy dark:text-[#F1F5F9] leading-relaxed whitespace-pre-wrap">
              {existingNote.note}
            </p>
            <p className="text-xs text-slate-accent dark:text-[#64748B] mt-2">
              {formatTimestamp(existingNote.createdAt)}
            </p>
          </>
        )}
      </div>
    );
  }

  // Add note form
  if (isAdding) {
    return (
      <div className="border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-900/10 rounded-r-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <StickyNote className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-semibold text-navy dark:text-white">Add Note</h3>
        </div>
        <Textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value.slice(0, MAX_CHARS))}
          placeholder="Add a note about this property..."
          className="min-h-[100px] bg-white dark:bg-[#112240] border-amber-200 dark:border-[#1D3461] text-sm"
          autoFocus
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-slate-accent dark:text-[#64748B]">
            {noteText.length}/{MAX_CHARS}
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsAdding(false);
                setNoteText('');
              }}
              className="text-slate-accent dark:text-[#94A3B8] hover:bg-amber-100 dark:hover:bg-amber-900/20"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={!noteText.trim()}
              className="bg-royal hover:bg-royal-dark text-white"
            >
              <Check className="w-3.5 h-3.5 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Add note button
  return (
    <button
      onClick={() => setIsAdding(true)}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors cursor-pointer"
    >
      <Plus className="w-4 h-4" />
      <span className="text-sm font-medium">Add Note</span>
    </button>
  );
}
