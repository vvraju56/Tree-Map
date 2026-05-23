import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image } from 'lucide-react';

const GENDERS = ['male', 'female'];

const defaultPerson = {
  name: '',
  gender: 'male',
  birthDate: '',
  deathDate: '',
  photo: '',
  notes: '',
  phone: '',
  email: '',
};

export default function PersonModal({ isOpen, onClose, onSave, editPerson }) {
  const [form, setForm] = useState(() => ({ ...defaultPerson, ...(editPerson || {}) }));
  const [photoMode, setPhotoMode] = useState('url'); // 'url' or 'upload'
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
    onClose();
  };

  const input = 'w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all';
  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(59,130,246,0.2)',
    color: '#e8e8f0',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md rounded-2xl p-6 z-10"
            style={{
              background: 'rgba(14,14,24,0.98)',
              border: '1px solid rgba(59,130,246,0.2)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ fontFamily: 'Cinzel', fontSize: 18, color: '#3b82f6' }}>
                {editPerson ? 'Edit Person' : 'Add Person'}
              </h2>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10" style={{ color: '#8888aa' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: '#e8e8f0' }}>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  className={input}
                  style={inputStyle}
                  placeholder="e.g. VishnuRaju"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              {/* Gender - Permanent */}
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: '#e8e8f0' }}>Gender <span style={{ color: '#ef4444' }}>*</span></label>
                <div className="flex gap-2">
                  {GENDERS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setForm({ ...form, gender: g })}
                      className="flex-1 py-2.5 rounded-xl text-sm capitalize transition-all font-medium"
                      style={{
                        background: form.gender === g ? 'rgba(59,130,246,0.25)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${form.gender === g ? '#3b82f6' : 'rgba(59,130,246,0.15)'}`,
                        color: form.gender === g ? '#3b82f6' : '#8888aa',
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Birth Year */}
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: '#e8e8f0' }}>Birth Year</label>
                <input
                  className={input}
                  style={inputStyle}
                  placeholder="e.g. 1985"
                  value={form.birthDate}
                  onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                />
              </div>

              {/* Death Year */}
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: '#e8e8f0' }}>Death Year</label>
                <input
                  className={input}
                  style={inputStyle}
                  placeholder="e.g. 2020"
                  value={form.deathDate}
                  onChange={(e) => setForm({ ...form, deathDate: e.target.value })}
                />
              </div>

              {/* Photo - Upload or Link */}
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: '#e8e8f0' }}>Photo</label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setPhotoMode('upload')}
                    className="flex-1 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2"
                    style={{
                      background: photoMode === 'upload' ? 'rgba(59,130,246,0.25)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${photoMode === 'upload' ? '#3b82f6' : 'rgba(59,130,246,0.15)'}`,
                      color: photoMode === 'upload' ? '#3b82f6' : '#8888aa',
                    }}
                  >
                    <Upload size={14} /> Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoMode('url')}
                    className="flex-1 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2"
                    style={{
                      background: photoMode === 'url' ? 'rgba(59,130,246,0.25)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${photoMode === 'url' ? '#3b82f6' : 'rgba(59,130,246,0.15)'}`,
                      color: photoMode === 'url' ? '#3b82f6' : '#8888aa',
                    }}
                  >
                    <Image size={14} /> Link
                  </button>
                </div>
                
                {photoMode === 'upload' ? (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all"
                      style={{ 
                        borderColor: form.photo ? '#3b82f6' : 'rgba(59,130,246,0.2)',
                        background: 'rgba(255,255,255,0.02)'
                      }}
                    >
                      {form.photo ? (
                        <img src={form.photo} alt="Preview" className="h-20 w-auto object-cover rounded-lg" />
                      ) : (
                        <>
                          <Upload size={20} style={{ color: '#8888aa' }} />
                          <span className="text-xs mt-1" style={{ color: '#8888aa' }}>Click to upload</span>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <input
                    className={input}
                    style={inputStyle}
                    placeholder="https://..."
                    value={form.photo}
                    onChange={(e) => setForm({ ...form, photo: e.target.value })}
                  />
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: '#e8e8f0' }}>Phone</label>
                <input
                  className={input}
                  style={inputStyle}
                  placeholder="+1 234 567"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: '#e8e8f0' }}>Email</label>
                <input
                  className={input}
                  style={inputStyle}
                  placeholder="email@..."
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: '#e8e8f0' }}>Notes</label>
                <textarea
                  className={input}
                  style={{ ...inputStyle, resize: 'none', height: 72 }}
                  placeholder="Any additional notes..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-sm transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#8888aa', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff' }}
                >
                  {editPerson ? 'Update' : 'Add Person'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
