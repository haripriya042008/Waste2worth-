import React, { useState, useEffect } from 'react';
import { publicPlaceService } from '../../services/publicPlaceService';
import Modal from '../../components/common/Modal';
import {
  MapPin,
  PlusCircle,
  Search,
  Trash2,
  Edit2,
  Clock,
  Phone,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const PublicPlacesManagement = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    placeType: 'Community Center',
    address: '',
    latitude: 12.9716,
    longitude: 77.5946,
    description: '',
    operatingHours: '8:00 AM - 8:00 PM',
    contactPerson: '',
    contactPhone: '',
    verificationStatus: 'Verified'
  });

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const res = await publicPlaceService.getPublicPlaces();
      setPlaces(res.data || []);
    } catch (err) {
      console.error('Failed to load public places:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      placeType: 'Community Center',
      address: '',
      latitude: 12.9716,
      longitude: 77.5946,
      description: '',
      operatingHours: '8:00 AM - 8:00 PM',
      contactPerson: '',
      contactPhone: '',
      verificationStatus: 'Verified'
    });
    setModalOpen(true);
  };

  const openEditModal = (place) => {
    setEditingId(place._id);
    setFormData({
      name: place.name,
      placeType: place.placeType,
      address: place.address,
      latitude: place.location?.coordinates?.[1] || 12.9716,
      longitude: place.location?.coordinates?.[0] || 77.5946,
      description: place.description || '',
      operatingHours: place.operatingHours || '8:00 AM - 8:00 PM',
      contactPerson: place.contactPerson || '',
      contactPhone: place.contactPhone || '',
      verificationStatus: place.verificationStatus || 'Verified'
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await publicPlaceService.updatePublicPlace(editingId, formData);
        setActionMessage('Distribution location updated.');
      } else {
        await publicPlaceService.createPublicPlace(formData);
        setActionMessage('New verified distribution hub created.');
      }
      setModalOpen(false);
      setTimeout(() => setActionMessage(''), 4000);
      fetchPlaces();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving location');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete public distribution place "${name}"?`)) return;
    try {
      await publicPlaceService.deletePublicPlace(id);
      setActionMessage(`Location "${name}" removed.`);
      setTimeout(() => setActionMessage(''), 4000);
      fetchPlaces();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting location');
    }
  };

  const placeTypes = [
    'Community Center',
    'Public Distribution Point',
    'Community Kitchen',
    'Public Park',
    'Municipal Shelter',
    'Religious Place/Trust',
    'Transit Station Hub',
    'Other'
  ];

  const filtered = places.filter((p) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return p.name.toLowerCase().includes(term) || p.address.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Civic Infrastructure Management
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Public Places & Distribution Hubs</h1>
          <p className="text-xs text-slate-500">
            Maintain verified public distribution sites, municipal dining halls, and transit shelters for MODULE 2 recommendations.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md transition flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Distribution Point</span>
        </button>
      </div>

      {actionMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Places Grid */}
      {loading ? (
        <div className="h-48 flex items-center justify-center text-xs text-slate-400">
          Loading distribution locations...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-xs text-slate-400">
          No public distribution places configured yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 font-bold">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                        {p.placeType}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{p.name}</h4>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {p.verificationStatus}
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2">{p.description}</p>

                <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <p className="flex items-start space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{p.address}</span>
                  </p>
                  <p className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{p.operatingHours}</span>
                  </p>
                  {p.contactPerson && (
                    <p className="flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{p.contactPerson} ({p.contactPhone})</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  onClick={() => openEditModal(p)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(p._id, p.name)}
                  className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Create / Edit */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Distribution Hub' : 'Add Verified Public Distribution Hub'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Place / Facility Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Cubbon Park Public Food Point"
              className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Place Type *</label>
              <select
                value={formData.placeType}
                onChange={(e) => setFormData({ ...formData, placeType: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-slate-50/50"
              >
                {placeTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Operating Hours</label>
              <input
                type="text"
                value={formData.operatingHours}
                onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                placeholder="e.g. 8:00 AM - 8:00 PM"
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Street Address *</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Street address, landmark, postal area"
              className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Person</label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="e.g. Officer Name"
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="+91 98450 00000"
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Facility Description</label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Covered drinking shelter with clean dining tables and security presence."
              className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow transition"
            >
              {editingId ? 'Save Changes' : 'Create Location'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PublicPlacesManagement;
